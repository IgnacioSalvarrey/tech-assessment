(function () {
  var KEY = 'aceup.seed';
  var DEFAULT_SEED = 1000;

  var params = new URLSearchParams(window.location.search);
  var raw = params.get('seed') || window.localStorage.getItem(KEY) || DEFAULT_SEED;
  var seed = parseInt(raw, 10);
  if (!seed || seed < 0) seed = DEFAULT_SEED;
  window.localStorage.setItem(KEY, String(seed));

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  window.AceUpSeed = {
    value: seed,
    makeRand: function (salt) {
      return mulberry32(seed + (salt || 0) * 7919);
    },
    withSeed: function (href) {
      var join = href.indexOf('?') === -1 ? '?' : '&';
      return href + join + 'seed=' + seed;
    }
  };
})();
