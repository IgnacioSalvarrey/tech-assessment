#!/usr/bin/env bash
#
# Build the candidate-facing homework zip for ONE candidate, with their seed
# stamped into every file that mentions it, and record the assignment.
#
# Internal only. The file list below is an allow-list: anything not named here
# (homework-evaluation/, seeds.md, PLAN.md, tools/) cannot reach the candidate.
#
#   make bundle SEED=2417 CANDIDATE=christiam
#
set -euo pipefail

cd "$(dirname "$0")/.."

SEED="${SEED:-}"
CANDIDATE="${CANDIDATE:-}"
SEEDS_FILE=seeds.md

die() { printf '\nerror: %s\n\n' "$1" >&2; exit 1; }

# ---------------------------------------------------------------- validation
usage="usage: make bundle SEED=<seed> CANDIDATE=<name>"
[ -n "$SEED" ]      || die "SEED is required.      $usage"
[ -n "$CANDIDATE" ] || die "CANDIDATE is required. $usage"
case "$SEED" in ''|*[!0-9]*) die "SEED must be a positive integer (got '$SEED')";; esac
[ "$SEED" -gt 0 ] || die "SEED must be a positive integer (got '$SEED')"
[ "$SEED" != 1000 ] || die "1000 is the app default — a candidate with no seed lands on it
       by accident, so it must never be handed out. Pick another seed;
       $SEEDS_FILE lists the verified ones."
command -v zip >/dev/null 2>&1 || die "zip is not installed"

# ------------------------------------------------------- seed ledger, part 1
if [ ! -f "$SEEDS_FILE" ]; then
  grep -v '_example_' seeds.example.md > "$SEEDS_FILE"
  echo "created $SEEDS_FILE from seeds.example.md (git-ignored)"
fi

# Only the assignment table has 6 columns; the reference table below it has 2.
if awk -F'|' -v s="$SEED" 'NF>=7 { c=$3; gsub(/[ \t]/,"",c); if (c==s) { print "       " $0; f=1 } } END { exit !f }' \
     "$SEEDS_FILE"; then
  die "seed $SEED is already assigned (row above). Seeds must not be reused
       within a round — the Tier B answer key would transfer between candidates."
fi

TIERB='_(node unavailable — fill in from bug-catalog.md)_'
if command -v node >/dev/null 2>&1; then
  TIERB=$(node -e '
function mulberry32(a){return function(){a|=0;a=(a+0x6d2b79f5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
var rand=mulberry32(Number(process.argv[1])+7919);
var pool=["fx_b1","fx_b2","fx_b3","fx_b4","fx_b5","fx_b6"];
for(var i=pool.length-1;i>0;i--){var j=Math.floor(rand()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
console.log(pool.slice(0,3).sort().map(function(f){return "`"+f+"`";}).join(", "));' "$SEED")
fi

# ------------------------------------------------------------ stage & stamp
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

for path in START-HERE.md Makefile docker-compose.yml app homework; do
  [ -e "$path" ] || die "missing candidate-facing path: $path"
  cp -R "$path" "$STAGE/"
done

rm -rf "$STAGE/homework/starter/node_modules" \
       "$STAGE/homework/starter/cypress/screenshots" \
       "$STAGE/homework/starter/cypress/videos"
find "$STAGE" -name .DS_Store -delete

stamp() {  # stamp <file> <sed-expr>...
  local f="$STAGE/$1"; shift
  [ -f "$f" ] || die "cannot stamp missing file: $1"
  sed "$@" "$f" > "$f.stamped" && mv "$f.stamped" "$f"
}

# The brief: fill the blank, and stop pointing at the email as the source.
grep -q '`______`' "$STAGE/homework/assignment.md" \
  || die "seed placeholder \`______\` not found in homework/assignment.md — did the brief change?"
stamp homework/assignment.md \
  -e "s/\`______\`/\`$SEED\`/" \
  -e 's/(in your assignment email — the/(the/'

# The quickstart: state the seed outright instead of deferring to the email.
stamp START-HERE.md \
  -e "s/Your assignment email contains a \*\*build seed\*\*\./Your **build seed is \`$SEED\`**./" \
  -e "s/1234/$SEED/g"

# The Makefile: drop the internal section, then make a bare `make start`
# correct for this candidate.
sed '/^# --- internal (not shipped to candidates)/,$d' "$STAGE/Makefile" \
  > "$STAGE/Makefile.stamped" && mv "$STAGE/Makefile.stamped" "$STAGE/Makefile"
sed -e 's/ seed-check bundle$/ seed-check/' "$STAGE/Makefile" \
  > "$STAGE/Makefile.stamped" && mv "$STAGE/Makefile.stamped" "$STAGE/Makefile"
if grep -q 'tools/bundle.sh' "$STAGE/Makefile"; then
  die "internal bundle target survived into the staged Makefile"
fi

grep -qE '^SEED \?= 1000$' "$STAGE/Makefile" \
  || die "'SEED ?= 1000' not found in Makefile — did the default change?"
stamp Makefile -e "s/^SEED ?= 1000$/SEED ?= $SEED/" -e "s/SEED=1234/SEED=$SEED/g"

# The starter scaffold: the native path has its own silent 1000 default.
grep -q "process.env.SEED || '1000'" "$STAGE/homework/starter/cypress.config.js" \
  || die "seed default not found in homework/starter/cypress.config.js — did the scaffold change?"
stamp homework/starter/cypress.config.js \
  -e "s/process.env.SEED || '1000'/process.env.SEED || '$SEED'/" \
  -e "s/SEED=1234/SEED=$SEED/g"
stamp homework/starter/README.md -e "s/1234/$SEED/g"

# The compose file: a third silent 1000, hit by anyone bypassing make.
grep -q '${SEED:-1000}' "$STAGE/docker-compose.yml" \
  || die "seed default not found in docker-compose.yml — did it change?"
stamp docker-compose.yml -e "s/\${SEED:-1000}/\${SEED:-$SEED}/"

# Nothing candidate-facing may still point at a seed that is not theirs.
if grep -rn '1234' "$STAGE/START-HERE.md" "$STAGE/Makefile" "$STAGE/homework" >/dev/null 2>&1; then
  grep -rn '1234' "$STAGE/START-HERE.md" "$STAGE/Makefile" "$STAGE/homework" >&2
  die "a stale example seed survived stamping (rows above)"
fi

# ------------------------------------------------------------------- bundle
slug=$(printf '%s' "$CANDIDATE" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/-$//')
OUT="${OUT:-../aceup-qa-homework-$slug.zip}"
mkdir -p "$(dirname "$OUT")"
OUT_ABS="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
rm -f "$OUT_ABS"
(cd "$STAGE" && zip -qr "$OUT_ABS" .)

# ------------------------------------------------------- seed ledger, part 2
row=$(printf '| %s | %s | %s | %s | | |' "$CANDIDATE" "$SEED" "$TIERB" "$(date +%F)")
awk -v row="$row" '
  { print }
  /^\|---\|---\|---\|---\|---\|---\|$/ && !done { print row; done=1 }
' "$SEEDS_FILE" > "$SEEDS_FILE.tmp" && mv "$SEEDS_FILE.tmp" "$SEEDS_FILE"

cat <<SUMMARY

  bundle    $OUT_ABS
  candidate $CANDIDATE
  seed      $SEED   (Tier B: $TIERB)
  recorded  $SEEDS_FILE

  The seed is stamped into assignment.md, START-HERE.md and the Makefile,
  so 'make start' is correct for them even with no arguments.
  Still put the seed in the email — belt and braces.

SUMMARY
