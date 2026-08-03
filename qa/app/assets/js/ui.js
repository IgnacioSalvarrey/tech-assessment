(function () {
  var MONTH_MS = 86400000;

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function parseDate(dateStr) {
    var parts = dateStr.split('-');
    return {
      y: parseInt(parts[0], 10),
      m: parseInt(parts[1], 10),
      d: parseInt(parts[2], 10)
    };
  }

  var UI = {
    qs: function (sel, root) {
      return (root || document).querySelector(sel);
    },

    qsa: function (sel, root) {
      return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    },

    param: function (name) {
      return new URLSearchParams(window.location.search).get(name);
    },

    go: function (href) {
      window.location.href = window.AceUpSeed.withSeed(href);
    },

    // keeps the seed across in-app navigation
    linkSeed: function () {
      UI.qsa('a[data-nav]').forEach(function (a) {
        a.setAttribute('href', window.AceUpSeed.withSeed(a.getAttribute('href')));
      });
      var note = UI.qs('#seed-note');
      if (note) note.textContent = 'build ' + window.AceUpSeed.value;
    },

    toast: function (message, isError) {
      var el = UI.qs('#toast');
      if (!el) return;
      el.textContent = message;
      el.className = 'show' + (isError ? ' error' : '');
      window.clearTimeout(el._t);
      el._t = window.setTimeout(function () {
        el.className = '';
      }, 1200);
    },

    fmtDateUS: function (dateStr) {
      var p = parseDate(dateStr);
      return pad(p.m) + '/' + pad(p.d) + '/' + p.y;
    },

    fmtDateEU: function (dateStr) {
      var p = parseDate(dateStr);
      return pad(p.d) + '/' + pad(p.m) + '/' + p.y;
    },

    fmtDayShort: function (dateStr) {
      var p = parseDate(dateStr);
      var d = new Date(p.y, p.m - 1, p.d);
      var names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return names[d.getDay()] + ' ' + p.d;
    },

    fmtHour: function (hour) {
      var suffix = hour >= 12 ? 'PM' : 'AM';
      var h = hour % 12 === 0 ? 12 : hour % 12;
      return h + ':00 ' + suffix;
    },

    // Renders a stored session time back in the coach's working timezone.
    sessionTime: function (session) {
      var ms = Date.parse(session.startsAt);
      var shifted = new Date(ms + (session.tzOffset || 0) * 3600000);
      return UI.fmtHour(shifted.getUTCHours());
    },

    sessionDate: function (session) {
      var ms = Date.parse(session.startsAt);
      var shifted = new Date(ms + (session.tzOffset || 0) * 3600000);
      return (
        shifted.getUTCFullYear() +
        '-' +
        pad(shifted.getUTCMonth() + 1) +
        '-' +
        pad(shifted.getUTCDate())
      );
    },

    openModal: function (id) {
      var el = document.getElementById(id);
      el.classList.add('open');
    },

    closeModal: function (id) {
      document.getElementById(id).classList.remove('open');
    },

    initials: function (name) {
      return name
        .split(' ')
        .map(function (part) {
          return part[0];
        })
        .slice(0, 2)
        .join('');
    },

    dayMs: MONTH_MS
  };

  window.AceUpUI = UI;
  document.addEventListener('DOMContentLoaded', UI.linkSeed);
})();
