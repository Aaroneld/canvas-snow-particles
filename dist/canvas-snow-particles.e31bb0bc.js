// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var MousePos = [Infinity, Infinity];
var DISPLACEMENT_FORCE_MAX = 2;
canvas.addEventListener("mousemove", function (e) {
  // console.log(MousePos);
  MousePos = [e.clientX, e.clientY];
});
bRect = canvas.getBoundingClientRect();
canvas.width = bRect.width;
canvas.height = bRect.height;
console.log(ctx);
console.log(canvas.width);
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 100, 300);

function returnRandomWindValue() {
  var RAND = Math.random();

  switch (RAND) {
    case RAND < 0.75:
      return 0;

    case RAND > 0.75 && RAND < 0.9:
      return Math.random() > 0.5 ? Math.random() : -Math.random();

    default:
      return Math.random() > 0.5 ? Math.random() * 1.5 : -Math.random() * 1.5;
  }
}

function createParticle() {
  return {
    x: ~~(Math.random() * canvas.width),
    y: -~~(Math.random() * canvas.height),
    windValue: returnRandomWindValue(),
    displacementVectorX: 0,
    displacementVectorY: 0,
    celeration: "NONE"
  };
}

function checkIfInMouseRange() {
  var particle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (Math.abs(particle.x - MousePos[0]) <= 10 && Math.abs(particle.y - MousePos[1]) <= 10) {
    particle.displacementVectorX = particle.x - MousePos[0] <= 0 ? -1 : 1;
    particle.displacementVectorY = particle.y - MousePos[1] <= 0 ? -1 : 1;
    particle.celeration = "INCREASING";
  }
}

function rectifyCeleration(value, particle) {
  if (value > 0.5 || value < -0.5) {
    if (particle.celeration === "INCREASING") {
      var _changedValue = value < 0 ? -(Math.abs(value) + 0.2 / 10 * DISPLACEMENT_FORCE_MAX) : Math.abs(value) + 0.2 / 10 * DISPLACEMENT_FORCE_MAX;

      if (Math.abs(_changedValue) > DISPLACEMENT_FORCE_MAX) particle.celeration = "DECREASING";
      return _changedValue;
    }

    var changedValue = value < 0 ? -(Math.abs(value) - 0.5 / 200 * DISPLACEMENT_FORCE_MAX) : Math.abs(value) - 0.5 / 200 * DISPLACEMENT_FORCE_MAX;
    if (Math.abs(changedValue) < 1) particle.celeration = "NONE";
    return changedValue;
  }

  return 0;
}

var particles = [];

for (i = 0; i < 3000; i++) {
  particles.push(createParticle());
} // function WindMap(particles) {
//     let windMap = [];
//     return function simulateWind(y, i) {
//         if (y < 0) {
//             windMap[i] = returnRandomWindValue();
//         }
//         const RAND = Math.random();
//         if (RAND > 0.9999) {
//             windMap[i] = returnRandomWindValue();
//         }
//         return windMap[i];
//     };
// }


function animation() {
  ctx.clearRect(0, 0, 5000, 5000);
  ctx.fillStyle = "white";
  var LENGTH = particles.length;

  for (i = LENGTH - 1; i > -1; i--) {
    ctx.beginPath();
    ctx.arc(particles[i].x, particles[i].y, i % 2 === 0 ? 1 : 2, 0, Math.PI * 2);
    ctx.fill();
    checkIfInMouseRange(particles[i]);
    particles[i].y > canvas.height ? particles[i] = createParticle() : particles[i] = {
      x: particles[i].x + particles[i].windValue + particles[i].displacementVectorX,
      y: particles[i].y + 0.5 + particles[i].displacementVectorY,
      windValue: particles[i].windValue,
      displacementVectorX: rectifyCeleration(particles[i].displacementVectorX, particles[i]),
      displacementVectorY: rectifyCeleration(particles[i].displacementVectorY, particles[i]),
      celeration: particles[i].celeration
    };
  } // particles = particles.map((particle, index) => {
  //     ctx.beginPath();
  //     ctx.arc(
  //         particle.x,
  //         particle.y,
  //         index % 2 === 0 ? 1 : 2,
  //         0,
  //         Math.PI * 2
  //     );
  //     ctx.fill();
  //     return particle.y > canvas.height
  //         ? createParticle()
  //         : {
  //               x: (particle.x += simulateWind(particle.y, index)),
  //               y: particle.y + 0.5,
  //           };
  // });


  requestAnimationFrame(animation);
}

animation();
},{}],"../../../../../../home/aaroneld/.nvm/versions/node/v12.18.2/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55390" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../home/aaroneld/.nvm/versions/node/v12.18.2/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/canvas-snow-particles.e31bb0bc.js.map