(function () {
  var KEY = 'aceup.state.' + window.AceUpSeed.value;

  function blank() {
    return {
      sessions: [],
      blocked: [],
      counters: {},
      cachedUpcoming: 0
    };
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return blank();
      var parsed = JSON.parse(raw);
      return Object.assign(blank(), parsed);
    } catch (err) {
      return blank();
    }
  }

  var state = load();

  function save() {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }

  function slotKey(coachId, date, hour) {
    return coachId + '|' + date + '|' + hour;
  }

  window.AceUpStore = {
    slotKey: slotKey,

    sessions: function () {
      return state.sessions.slice();
    },

    session: function (id) {
      return state.sessions.filter(function (s) {
        return s.id === id;
      })[0];
    },

    addSession: function (session) {
      state.sessions.push(session);
      save();
      return session;
    },

    patchSession: function (id, patch) {
      state.sessions = state.sessions.map(function (s) {
        return s.id === id ? Object.assign({}, s, patch) : s;
      });
      save();
    },

    block: function (key) {
      if (state.blocked.indexOf(key) === -1) state.blocked.push(key);
      save();
    },

    unblock: function (key) {
      state.blocked = state.blocked.filter(function (k) {
        return k !== key;
      });
      save();
    },

    isBlocked: function (key) {
      return state.blocked.indexOf(key) !== -1;
    },

    bump: function (name) {
      state.counters[name] = (state.counters[name] || 0) + 1;
      save();
      return state.counters[name];
    },

    cachedUpcoming: function (value) {
      if (typeof value === 'number') {
        state.cachedUpcoming = value;
        save();
      }
      return state.cachedUpcoming;
    },

    reset: function () {
      state = blank();
      save();
    }
  };
})();
