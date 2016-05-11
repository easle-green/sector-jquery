/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var progressbar = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports) {

	;
	(function() {
	  'use strict';
	  var now = new Date();
	  console.log(+now);

	  var timeData = getPlaytime();

	  function getPlaytime() {
	    var data;
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', 'playtime.json', false);
	    xhr.send();
	    if (xhr.status != 200) {
	      console.log(xhr.status + ':' + xhr.statusText);
	    } else {
	      data = JSON.parse(xhr.responseText);
	      return data;
	    }
	  }

	  function rendering(startTimeServer, length) {
	    var now = new Date();
	    var currentTime = now - startTimeServer;
	    var progress = currentTime / (length * 1000);

	    var cns = document.getElementById('progress-bar');
	    var ctx = cns.getContext('2d');

	    ctx.save();
	    ctx.clearRect(0, 0, 140, 140);
	    ctx.translate(70, 70);
	    ctx.rotate(-Math.PI / 2);
	    ctx.lineWidth = 32;
	    ctx.lineCap = "round";

	    writeTime(ctx);

	    cns.style.position = "absolute";
	    cns.style.top = "50px";
	    cns.style.left = "50%";
	    cns.style.marginLeft = "-70px";

	    function writeTime(ctx) {
	      ctx.strokeStyle = 'rgba(0,0,0,.5)';
	      ctx.beginPath();
	      partialCircle(ctx, 0, 0, 54);
	      ctx.scale(1, 1);
	      ctx.stroke();
	      ctx.restore();
	    }

	    function partialCircle(ctx, x, y, rad) {
	      ctx.arc(x, y, rad, 0, progress * (Math.PI * 2), false);
	      return ctx;
	    }
	  }

	  setInterval(function() {
	    rendering(timeData.serverTime, timeData.length);
	  }, 66);
	})();


/***/ }
/******/ ]);