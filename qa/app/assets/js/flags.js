(function () {
  var rand = window.AceUpSeed.makeRand(1);

  var flags = {
    fx_a1: true,
    fx_a2: true,
    fx_a3: true,
    fx_a4: true,
    fx_a5: true,
    fx_b1: false,
    fx_b2: false,
    fx_b3: false,
    fx_b4: false,
    fx_b5: false,
    fx_b6: false
  };

  var pool = ['fx_b1', 'fx_b2', 'fx_b3', 'fx_b4', 'fx_b5', 'fx_b6'];
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(rand() * (i + 1));
    var tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  pool.slice(0, 3).forEach(function (key) {
    flags[key] = true;
  });

  window.Fx = function (key) {
    return flags[key] === true;
  };
})();
