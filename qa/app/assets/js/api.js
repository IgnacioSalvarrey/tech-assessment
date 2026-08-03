(function () {
  var latencyRand = window.AceUpSeed.makeRand(2);
  var replyRand = window.AceUpSeed.makeRand(4);

  var NOTES_LIMIT = 280;
  var BOOK_FAILS_ON_ATTEMPT = 4;
  var CHAT_FAILS_ON_MESSAGE = 3;

  var cache = {};

  function delay() {
    return new Promise(function (resolve) {
      setTimeout(resolve, 200 + Math.floor(latencyRand() * 700));
    });
  }

  function json(path) {
    if (!cache[path]) {
      cache[path] = fetch(path).then(function (res) {
        return res.json();
      });
    }
    return cache[path];
  }

  function fail(code, message) {
    var err = new Error(message || code);
    err.code = code;
    return err;
  }

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) % 100000;
    }
    return h;
  }

  // Slots that were "already taken" before this browser session, derived from the
  // seed so the grid is identical on every run.
  function preTaken(coachId, date, hour) {
    var base = hash(coachId + date + hour + window.AceUpSeed.value) / 100000;
    return base < 0.25;
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function offsetSuffix(offset) {
    if (offset === 0) return '+00:00';
    var sign = offset > 0 ? '+' : '-';
    return sign + pad(Math.abs(offset)) + ':00';
  }

  var Api = {
    NOTES_LIMIT: NOTES_LIMIT,

    coaches: function () {
      return delay().then(function () {
        return json('data/coaches.json');
      });
    },

    coach: function (id) {
      return Api.coaches().then(function (list) {
        return (
          list.filter(function (c) {
            return c.id === id;
          })[0] || list[0]
        );
      });
    },

    config: function () {
      return json('data/slots.json');
    },

    days: function () {
      return Api.config().then(function (cfg) {
        var out = [];
        var start = new Date();
        start.setHours(0, 0, 0, 0);
        for (var i = 1; i <= cfg.daysAhead; i++) {
          var d = new Date(start.getTime() + i * 86400000);
          out.push(
            d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
          );
        }
        return out;
      });
    },

    slots: function (coachId, date) {
      return delay()
        .then(function () {
          return Api.config();
        })
        .then(function (cfg) {
          return cfg.hours.map(function (hour) {
            var key = window.AceUpStore.slotKey(coachId, date, hour);
            return {
              hour: hour,
              key: key,
              available: !preTaken(coachId, date, hour) && !window.AceUpStore.isBlocked(key)
            };
          });
        });
    },

    book: function (payload) {
      var attempt = window.AceUpStore.bump('book');
      return delay().then(function () {
        if (attempt === BOOK_FAILS_ON_ATTEMPT) {
          throw fail('SERVER_ERROR');
        }

        if (payload.guestEmail && !window.Fx('fx_b5')) {
          var ok = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(payload.guestEmail);
          if (!ok) throw fail('VALIDATION', 'Guest email is not valid.');
        }

        var notes = (payload.notes || '').slice(0, NOTES_LIMIT);

        var suffix = window.Fx('fx_a1') ? 'Z' : offsetSuffix(payload.tzOffset);
        var startsAt =
          payload.date + 'T' + pad(payload.hour) + ':00:00' + suffix;

        var session = {
          id: 'S' + Date.now() + '-' + Math.floor(latencyRand() * 1000),
          coachId: payload.coachId,
          coachName: payload.coachName,
          tzOffset: payload.tzOffset,
          tzLabel: payload.tzLabel,
          date: payload.date,
          hour: payload.hour,
          startsAt: startsAt,
          duration: payload.duration,
          notes: notes,
          guestEmail: payload.guestEmail || '',
          status: 'confirmed'
        };

        window.AceUpStore.addSession(session);
        window.AceUpStore.block(
          window.AceUpStore.slotKey(payload.coachId, payload.date, payload.hour)
        );
        window.AceUpStore.cachedUpcoming(
          window.AceUpStore.sessions().filter(function (s) {
            return s.status === 'confirmed';
          }).length
        );
        return session;
      });
    },

    cancel: function (id) {
      return delay().then(function () {
        var session = window.AceUpStore.session(id);
        if (!session) throw fail('NOT_FOUND');
        window.AceUpStore.patchSession(id, { status: 'cancelled' });

        if (!window.Fx('fx_a3')) {
          window.AceUpStore.unblock(
            window.AceUpStore.slotKey(session.coachId, session.date, session.hour)
          );
        }

        if (!window.Fx('fx_b6')) {
          window.AceUpStore.cachedUpcoming(
            window.AceUpStore.sessions().filter(function (s) {
              return s.status === 'confirmed';
            }).length
          );
        }
        return true;
      });
    },

    reschedule: function (id, date, hour) {
      return delay().then(function () {
        var session = window.AceUpStore.session(id);
        if (!session) throw fail('NOT_FOUND');

        window.AceUpStore.unblock(
          window.AceUpStore.slotKey(session.coachId, session.date, session.hour)
        );

        var suffix = window.Fx('fx_a1') ? 'Z' : offsetSuffix(session.tzOffset);
        var patch = {
          date: date,
          hour: hour,
          startsAt: date + 'T' + pad(hour) + ':00:00' + suffix,
          status: 'confirmed'
        };
        if (window.Fx('fx_b2')) patch.duration = 30;

        window.AceUpStore.patchSession(id, patch);
        window.AceUpStore.block(window.AceUpStore.slotKey(session.coachId, date, hour));
        return window.AceUpStore.session(id);
      });
    },

    chat: function (text) {
      var n = window.AceUpStore.bump('chat');
      return delay()
        .then(delay)
        .then(function () {
          if (n === CHAT_FAILS_ON_MESSAGE) throw fail('SERVER_ERROR');
          return json('data/chat-scripts.json');
        })
        .then(function (scripts) {
          var lower = text.toLowerCase();
          var hit = scripts.keywords.filter(function (entry) {
            return entry.match.some(function (word) {
              return lower.indexOf(word) !== -1;
            });
          })[0];
          if (hit) return hit.reply;
          var pool = scripts.fallbacks;
          return pool[Math.floor(replyRand() * pool.length)];
        });
    },

    greeting: function () {
      return json('data/chat-scripts.json').then(function (s) {
        return s.greeting;
      });
    }
  };

  window.AceUpApi = Api;
})();
