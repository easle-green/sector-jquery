/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	window.volumeSlider = function (opts) {
	
		var isMouseDown = false,
			currentVal = 0,
			currentFill = 0,
			startMouseY,
			lastElemTop;
	
		var startSlide = function (e) {
	
			isMouseDown = true;
			var pos = getMousePosition(e);
			startMouseY = pos.y;
			console.log($(this).offset().top, $(this).parent().offset().top);
			// ?
			lastElemTop = ($(this).offset().top - $(this).parent().offset().top);
			updatePosition(e);
	
			return false;
		};
	
		var getMousePosition = function (e) {
			//container.animate({ scrollTop: rowHeight }, options.scrollSpeed, 'linear', ScrollComplete());
			var posx = 0;
			var posy = 0;
	
			if (!e) var e = window.event;
	
			if (e.pageX || e.pageY) {
				posx = e.pageX;
				posy = e.pageY;
			}
			else if (e.clientX || e.clientY) {
				posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
			}
	
			return { 'x': posx, 'y': posy };
		};
	
		var updatePosition = function (e) {
			var pos = getMousePosition(e);
	
			var spanY = (pos.y - startMouseY);
	
			var newPos = (lastElemTop + spanY);
			// ?
			var upperBound = (opts.container.height()-opts.point.height());
	
			newPos = Math.max(0,newPos);
			newPos = Math.min(newPos,upperBound);
			currentVal = Math.round((newPos/upperBound)*100,0);
			currentFill = upperBound - newPos + opts.point.height()/2;
	
			opts.point.css("top", newPos);
			opts.fill.css("height", currentFill);
			opts.tooltip.html(100-currentVal);
			opts.callback(100-currentVal);
		};
	
		var moving = function (e) {
			if(isMouseDown){
				updatePosition(e);
				return false;
			}
		};
	
		var dropCallback = function (e) {
			isMouseDown = false;
			opts.point.removeClass('moving');
		};
	
		opts.point.bind('mousedown', startSlide);
	
		$(document).mousemove(function (e) {
			moving(e);
			if ( isMouseDown ) {
				opts.point.addClass('moving');
			}
		});
	
		$(document).mouseup(function (e) {
			dropCallback(e);
		});
	
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	window.SECTOR = window.SECTOR || {};
	
	$(document).ready(function() {
	
	  // buttons animation
	  $('#play').css({
	    backgroundSize: "cover"
	  });
	
	
	  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
	    $('body').addClass('is_mobile');
	  }
	
	  // плеер
	  var current = $('.player__bitrate-active > .player__bitrate-name'),
	    current = {
	      channel: current.data('channel'),
	      source: current.attr('rel')
	    };
	
	  window.currentVolume = .75;
	
	  initPlayer(current.channel, current.source);
	
	  volumeSlider({
	    container: $('#volume .equalizer__container-line'),
	    point: $('#volume .equalizer__container-point'),
	    tooltip: $('#volume .player__volume-size'),
	    fill: $('#volume .equalizer__container-bg'),
	    callback: function(volume) {
	      window.currentVolume = volume / 100;
	      changeVolume(volume);
	    }
	  });
	
	  $('#play')
	    .click(function() {
	      if (!$(this).hasClass('pause')) {
	        buttonPlay(true);
	        $("#jplayer").jPlayer('play');
	      } else {
	        buttonPlay(false);
	        $("#jplayer").jPlayer('stop');
	      }
	    });
	
	
	
	  // изменение битрейта
	  $('#player-bitrate .player__bitrate-name').click(function() {
	    if ($(this).parent().hasClass('.player__bitrate-active')) {
	      return;
	    }
	
	    var bitrate = $('#player-bitrate'),
	      active = bitrate.find('.player__bitrate-active'),
	      value = parseInt($(this).prop('rel')),
	      channel = $(this).data('channel'),
	      current_value = parseInt(active.children('a').prop('rel')),
	      //percent = parseInt($(this).data('color')),
	      player = $("#jplayer"),
	      play = $('#play'),
	      played = play.hasClass('pause');
	
	    animateBitrate($('#equalizer .' + current_value + 'k'), value, (
	      current_value < value ? 'up' : 'down'));
	    active.removeClass('player__bitrate-active');
	    $(this).parent().addClass('player__bitrate-active');
	    //changeColor(lighten($default_color, percent));
	
	    if (played) {
	      player.jPlayer("stop");
	      play.removeClass('pause');
	    }
	
	    player.jPlayer("destroy");
	    initPlayer(channel, value);
	
	    if (played) {
	      setTimeout(function() {
	        play.addClass('pause');
	        $("#jplayer").jPlayer('play');
	      }, 250)
	    }
	  });
	
	  // скроллинг
	  /*
	  $('#history-block')
	      .height($(window).height())
	      .mCustomScrollbar({
	          mouseWheelPixels: 1000,
	          scrollButtons:{
	              enable: true
	          },
	          advanced:{
	              updateOnBrowserResize: true,
	              updateOnContentResize: true,
	              normalizeMouseWheelDelta: true
	          },
	          contentTouchScroll: true
	      });
	  */
	
	  $('#tabs .menu__list-item').click(function() {
	    if ($(this).hasClass('active')) {
	      return;
	    }
	    var index = $(this).index();
	    $('#tabs .menu__list-item.active').removeClass('active');
	    $(this).addClass('active');
	
	    $('#tabs_content > .active')
	      .removeClass('active')
	      .slideUp();
	
	    $($('#tabs_content > div')[index])
	      .addClass('active')
	      .slideDown();
	  });
	
	
	  $(window).bind('resize', function() {
	    $('body').css('width', $(document).width());
	  });
	
	});
	
	animateBitrate = function(curr, rate, dir) {
	  var up = (dir === 'up'),
	    left = (up ? 0 : '-20px'),
	    next;
	
	  if (dir === 'up') {
	    next = curr.next();
	  } else {
	    next = curr.prev();
	  }
	
	  if (!up) {
	    curr.addClass('disabled');
	  }
	  curr.find('div:first > b').stop().animate({
	    left: left
	  }, 100);
	  curr.find('div:last').stop().animate({
	    left: left
	  }, 100, function() {
	    if (up) {
	      curr.removeClass('disabled');
	    }
	    if (!curr.hasClass(rate + 'k') && !(!up && curr.prev().hasClass(rate +
	        'k'))) {
	      animateBitrate(next, rate, dir);
	    } // else {
	    //   changeBitrate(up);
	    //}
	  });
	
	};
	
	/*changeBitrate = function(up) {
	    $('#equalizer > li').each(function(){
	        var current = parseInt($(this).attr('class').replace(/size(\d+) (.+)/, '$1').replace('size', '')),
	            change = current + (up? 10 : -10);
	
	        console.log(current)
	
	        if (change <= 90 && change > 0) {
	            $(this)
	                .removeClass('size'+current)
	                .addClass('size'+change)
	        }
	
	    });
	
	}*/
	
	initPlayer = function(channel, ices) {
	  $("#jplayer").jPlayer({
	    volume: window.currentVolume,
	    ready: function() {
	      $(this).jPlayer("setMedia", {
	        oga: "http://89.223.45.5:8000/" + channel + "-" + ices
	      });
	      // ready callback
	    },
	    swfPath: "images",
	    supplied: "oga"
	  });
	};
	
	changeVolume = function(volume) {
	  $("#jplayer").jPlayer("option", "volume", window.currentVolume);
	};
	
	/*
	checkTime = function() {
	    var now = new Date(),
	        hours = now.getHours(),
	        night = '#6A758D',
	        evening = '#20A0A5';
	
	    if(hours<7 || hours>22) {
	        changeColor(night);
	        return night;
	    } else if (hours>=7 && hours <= 12) {
	        changeColor(evening);
	        return evening;
	    }
	};
	
	
	changeColor = function(color) {
	    $('body').css('background-color', color);
	    return color;
	}
	
	
	lighten = function (color, light) {
	    color = color.replace(/[^0-9,]+/g, "");
	    var red = color.split(",")[0];
	    var gre = color.split(",")[1];
	    var blu = color.split(",")[2];
	
	    var hsv = RgbToHsv(red,gre,blu);
	    var rgb = HsvToRgb(hsv.h, hsv.s, light);
	
	    return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
	}
	*/
	
	
	
	buttonPlay = function($play) {
	  $('#play').stop().animate({
	    width: '70px',
	    height: '70px',
	    top: '5px',
	    left: '5px'
	  }, 50, function() {
	    if ($play)
	      $(this).addClass('pause');
	    else
	      $(this).removeClass('pause');
	    $(this).stop().animate({
	      width: '80px',
	      height: '80px',
	      top: 0,
	      left: 0
	    }, 70, 'easeOutCirc');
	  });
	};
	
	
	/* ----------------------------------
	
	function RgbToHsv(r, g, b) {
	    var min = Math.min(r, g, b),
	        max = Math.max(r, g, b),
	        delta = max - min,
	        h, s, v = max;
	
	    v = Math.floor(max / 255 * 100);
	    if (max == 0) return [0, 0, 0];
	    s = Math.floor(delta / max * 100);
	    var deltadiv = delta == 0 ? 1 : delta;
	    if( r == max ) h = (g - b) / deltadiv;
	    else if(g == max) h = 2 + (b - r) / deltadiv;
	    else h = 4 + (r - g) / deltadiv;
	    h = Math.floor(h * 60);
	    if( h < 0 ) h += 360;
	    return { h: h, s:s, v:v }
	}
	
	function HsvToRgb(h, s, v) {
	    h = h / 360;
	    s = s / 100;
	    v = v / 100;
	
	    if (s == 0)
	    {
	        var val = Math.round(v * 255);
	        return {r:val,g:val,b:val};
	    }
	    hPos = h * 6;
	    hPosBase = Math.floor(hPos);
	    base1 = v * (1 - s);
	    base2 = v * (1 - s * (hPos - hPosBase));
	    base3 = v * (1 - s * (1 - (hPos - hPosBase)));
	    if (hPosBase == 0) {red = v; green = base3; blue = base1}
	    else if (hPosBase == 1) {red = base2; green = v; blue = base1}
	    else if (hPosBase == 2) {red = base1; green = v; blue = base3}
	    else if (hPosBase == 3) {red = base1; green = base2; blue = v}
	    else if (hPosBase == 4) {red = base3; green = base1; blue = v}
	    else {red = v; green = base1; blue = base2};
	
	    red = Math.round(red * 255);
	    green = Math.round(green * 255);
	    blue = Math.round(blue * 255);
	    return {r:red,g:green,b:blue};
	}
	*/


/***/ },
/* 3 */
/***/ function(module, exports) {

	(function (SECTOR) {
	    'use strict';
	
	    var progress = {
	
	        /*  Use api instead of playtime.json, where:
	            timestamp - current server timestamp, unixtime (note that js need 1000 multiplier)
	            serverTime - server time when track was started playing, unixtime
	         */
	        //apiPoint: 'http://sectorradio.ru/api/track.php',
	
	        timer: {},
	        apiPromise: {},
	        url: 'http://sectorradio.ru/api/track.php',
	        needUpdate: false,
	        updateTimeout: 0,
	
	        init: function () {
	            this.addCanvas();
	            this.url += '?' + Date.now();
	            this.getPlaytime();
	            return this;
	        },
	
	      addCanvas: function() {
	        var cns = document.createElement('canvas');
	        var container = document.getElementById('player');
	
	        container.insertBefore(cns, container.firstChild);
	
	        cns.id = 'progress-bar';
	        cns.height = '140';
	        cns.width = '140';
	        cns.style.position = "absolute";
	        cns.style.top = "50px";
	        cns.style.left = "50%";
	        cns.style.marginLeft = "-70px";
	      },
	
	
	        startRender: function () {
	            this.interval = setInterval((function() {
	                this.renderBar();
	            }).bind(this), 66);
	        },
	
	
	        getPlaytime: function () {
	          this.apiPromise = fetch(this.url)
	            .then(function (response) {
	              return response.json();
	            })
	            .then((function (data) {
	              this.timer = data;
	              this.startRender();
	              return data;
	            }).bind(this));
	        },
	
	
	        renderBar: function () {
	            var now = new Date();
	            var currentTime = now - this.timer.serverTime * 1000;
	            var progress = currentTime / (this.timer.length * 1000);
	            var cns = document.getElementById('progress-bar');
	            var ctx = cns.getContext('2d');
	
	            ctx.save();
	            ctx.clearRect(0, 0, 140, 140);
	            ctx.translate(70, 70);
	            ctx.rotate(-Math.PI / 2);
	            ctx.lineWidth = 11;
	            ctx.lineCap = "round";
	
	            writeTime(ctx);
	
	            function writeTime(ctx) {
	                ctx.strokeStyle = 'rgba(255, 255, 255, .55)';
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
	
	            if (progress > 1) {
	              clearInterval(this.interval);
	              this.updatePlaytime(this.updateTimeout);
	            } else {
	              this.updateTimeout = 0;
	            }
	        },
	
	      updatePlaytime: function (time) {
	        setTimeout((function () {
	          this.getPlaytime();
	        }).bind(this), time);
	
	        this.updateTimeout = 3000;
	      }
	
	    };
	
	    // TODO make module updateStatus from common.js and request nowplaying only when timer is ready
	    SECTOR.progress = progress.init();
	
	})(window.SECTOR);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	window.programActive = {
	  rows: document.getElementsByClassName('programs__row'),
	
	  breakPoints: [],
	
	  time: {},
	
	  init: function () {
	    this.setBreakpoints();
	    this.getTimezone();
	  },
	
	  setBreakpoints: function () {
	    for (var i = 0; i < this.rows.length; i++) {
	      this.breakPoints.push(Number(this.rows[i].getAttribute('data-time')));
	    }
	  },
	
	  getTimezone: function () {
	    SECTOR.progress.apiPromise
	      .then((function (data) {
	        this.serverTime = data.timestamp;
	        this.updateServerTime();
	        clearInterval(this.interval);
	        
	        this.interval = setInterval((function() {
	          this.serverTime += 1;
	          this.updateServerTime();
	        }).bind(this), 1000);
	
	        this.setUpdateInterval(0);
	      }).bind(this));
	  },
	
	  updateServerTime: function () {
	    this.time.now = new Date(this.serverTime*1000);
	    this.time.hours = this.time.now.getHours();
	    this.time.minutes = this.time.now.getMinutes();
	    this.time.seconds = this.time.now.getSeconds();
	    this.time.moscowHours = ((this.time.hours + this.time.now.getTimezoneOffset()/60) + 3);
	  },
	
	  getBreakpoint: function () {
	    if (this.time.moscowHours % 2) {
	      this.nextBreakpointIn = (60 - this.time.seconds) * 1000 + (119 - this.time.minutes) * 60 * 1000;
	    } else {
	      this.nextBreakpointIn = (60 - this.time.seconds) * 1000 + (59 - this.time.minutes) * 60 * 1000;
	    }
	  },
	
	  getActiveRow: function () {
	    if (this.time.moscowHours % 2) {
	      this.activeRow = this.breakPoints.indexOf(this.time.moscowHours);
	
	    } else {
	      this.activeRow = this.breakPoints.indexOf(this.time.moscowHours - 1);
	    }
	  },
	
	  setUpdateInterval: function (time) {
	    setTimeout((function () {
	      if (time) {
	        this
	          .rows[this.activeRow]
	          .classList
	          .toggle('programs__row-active');
	      }
	      
	      this.getActiveRow();
	      this
	        .rows[this.activeRow]
	        .classList
	        .toggle('programs__row-active');
	
	      this.getBreakpoint();
	      if (true) {
	        console.log(this.nextBreakpointIn);
	      }
	      this.setUpdateInterval(this.nextBreakpointIn);
	    }).bind(this), time);
	  }
	};
	
	programActive.init();

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTFmMTE0NTU3OTU0ZDVmOTBhZjQiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NjcmlwdHMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc2NyaXB0cy9QUFNsaWRlci5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc2NyaXB0cy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NjcmlwdHMvcHJvZ3Jlc3NiYXIuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NjcmlwdHMvcHJvZ3JhbUFjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0xBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVU7QUFDVjs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRTs7QUFFRjtBQUNBO0FBQ0EsR0FBRTs7QUFFRjs7Ozs7OztBQ3ZGQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOzs7QUFHSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxNQUFLOzs7O0FBSUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVztBQUNYO0FBQ0EsUUFBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOzs7QUFHSDtBQUNBO0FBQ0EsSUFBRzs7QUFFSCxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBSzs7QUFFTCxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsSUFBRztBQUNIOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXdCLFFBQVEsZUFBZTtBQUMvQyw4QkFBNkIsWUFBWSxXQUFXO0FBQ3BELDhCQUE2QixZQUFZLFdBQVc7QUFDcEQsOEJBQTZCLFlBQVksZUFBZTtBQUN4RCw4QkFBNkIsWUFBWSxlQUFlO0FBQ3hELFdBQVUsUUFBUSxlQUFlOztBQUVqQztBQUNBO0FBQ0E7QUFDQSxhQUFZO0FBQ1o7QUFDQTs7Ozs7OztBQy9TQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWlCO0FBQ2pCLHVCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7OztBQUdUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7OztBQUdUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQy9HRDtBQUNBOztBQUVBOztBQUVBLFdBQVU7O0FBRVY7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQSxRQUFPO0FBQ1AsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUEsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUEsc0IiLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDExZjExNDU1Nzk1NGQ1ZjkwYWY0XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxucmVxdWlyZSgnLi9QUFNsaWRlcicpO1xyXG5yZXF1aXJlKCcuL2NvbW1vbicpO1xyXG5yZXF1aXJlKCcuL3Byb2dyZXNzYmFyJyk7XHJcbnJlcXVpcmUoJy4vcHJvZ3JhbUFjdGl2ZScpO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXNzZXRzL3NjcmlwdHMvbWFpbi5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbndpbmRvdy52b2x1bWVTbGlkZXIgPSBmdW5jdGlvbiAob3B0cykge1xyXG5cclxuXHR2YXIgaXNNb3VzZURvd24gPSBmYWxzZSxcclxuXHRcdGN1cnJlbnRWYWwgPSAwLFxyXG5cdFx0Y3VycmVudEZpbGwgPSAwLFxyXG5cdFx0c3RhcnRNb3VzZVksXHJcblx0XHRsYXN0RWxlbVRvcDtcclxuXHJcblx0dmFyIHN0YXJ0U2xpZGUgPSBmdW5jdGlvbiAoZSkge1xyXG5cclxuXHRcdGlzTW91c2VEb3duID0gdHJ1ZTtcclxuXHRcdHZhciBwb3MgPSBnZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0c3RhcnRNb3VzZVkgPSBwb3MueTtcclxuXHRcdGNvbnNvbGUubG9nKCQodGhpcykub2Zmc2V0KCkudG9wLCAkKHRoaXMpLnBhcmVudCgpLm9mZnNldCgpLnRvcCk7XHJcblx0XHQvLyA/XHJcblx0XHRsYXN0RWxlbVRvcCA9ICgkKHRoaXMpLm9mZnNldCgpLnRvcCAtICQodGhpcykucGFyZW50KCkub2Zmc2V0KCkudG9wKTtcclxuXHRcdHVwZGF0ZVBvc2l0aW9uKGUpO1xyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cclxuXHR2YXIgZ2V0TW91c2VQb3NpdGlvbiA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHQvL2NvbnRhaW5lci5hbmltYXRlKHsgc2Nyb2xsVG9wOiByb3dIZWlnaHQgfSwgb3B0aW9ucy5zY3JvbGxTcGVlZCwgJ2xpbmVhcicsIFNjcm9sbENvbXBsZXRlKCkpO1xyXG5cdFx0dmFyIHBvc3ggPSAwO1xyXG5cdFx0dmFyIHBvc3kgPSAwO1xyXG5cclxuXHRcdGlmICghZSkgdmFyIGUgPSB3aW5kb3cuZXZlbnQ7XHJcblxyXG5cdFx0aWYgKGUucGFnZVggfHwgZS5wYWdlWSkge1xyXG5cdFx0XHRwb3N4ID0gZS5wYWdlWDtcclxuXHRcdFx0cG9zeSA9IGUucGFnZVk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRZKSB7XHJcblx0XHRcdHBvc3ggPSBlLmNsaWVudFggKyBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcclxuXHRcdFx0cG9zeSA9IGUuY2xpZW50WSArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHsgJ3gnOiBwb3N4LCAneSc6IHBvc3kgfTtcclxuXHR9O1xyXG5cclxuXHR2YXIgdXBkYXRlUG9zaXRpb24gPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dmFyIHBvcyA9IGdldE1vdXNlUG9zaXRpb24oZSk7XHJcblxyXG5cdFx0dmFyIHNwYW5ZID0gKHBvcy55IC0gc3RhcnRNb3VzZVkpO1xyXG5cclxuXHRcdHZhciBuZXdQb3MgPSAobGFzdEVsZW1Ub3AgKyBzcGFuWSk7XHJcblx0XHQvLyA/XHJcblx0XHR2YXIgdXBwZXJCb3VuZCA9IChvcHRzLmNvbnRhaW5lci5oZWlnaHQoKS1vcHRzLnBvaW50LmhlaWdodCgpKTtcclxuXHJcblx0XHRuZXdQb3MgPSBNYXRoLm1heCgwLG5ld1Bvcyk7XHJcblx0XHRuZXdQb3MgPSBNYXRoLm1pbihuZXdQb3MsdXBwZXJCb3VuZCk7XHJcblx0XHRjdXJyZW50VmFsID0gTWF0aC5yb3VuZCgobmV3UG9zL3VwcGVyQm91bmQpKjEwMCwwKTtcclxuXHRcdGN1cnJlbnRGaWxsID0gdXBwZXJCb3VuZCAtIG5ld1BvcyArIG9wdHMucG9pbnQuaGVpZ2h0KCkvMjtcclxuXHJcblx0XHRvcHRzLnBvaW50LmNzcyhcInRvcFwiLCBuZXdQb3MpO1xyXG5cdFx0b3B0cy5maWxsLmNzcyhcImhlaWdodFwiLCBjdXJyZW50RmlsbCk7XHJcblx0XHRvcHRzLnRvb2x0aXAuaHRtbCgxMDAtY3VycmVudFZhbCk7XHJcblx0XHRvcHRzLmNhbGxiYWNrKDEwMC1jdXJyZW50VmFsKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgbW92aW5nID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmKGlzTW91c2VEb3duKXtcclxuXHRcdFx0dXBkYXRlUG9zaXRpb24oZSk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHR2YXIgZHJvcENhbGxiYWNrID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlzTW91c2VEb3duID0gZmFsc2U7XHJcblx0XHRvcHRzLnBvaW50LnJlbW92ZUNsYXNzKCdtb3ZpbmcnKTtcclxuXHR9O1xyXG5cclxuXHRvcHRzLnBvaW50LmJpbmQoJ21vdXNlZG93bicsIHN0YXJ0U2xpZGUpO1xyXG5cclxuXHQkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24gKGUpIHtcclxuXHRcdG1vdmluZyhlKTtcclxuXHRcdGlmICggaXNNb3VzZURvd24gKSB7XHJcblx0XHRcdG9wdHMucG9pbnQuYWRkQ2xhc3MoJ21vdmluZycpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRkcm9wQ2FsbGJhY2soZSk7XHJcblx0fSk7XHJcblxyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXNzZXRzL3NjcmlwdHMvUFBTbGlkZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ3aW5kb3cuU0VDVE9SID0gd2luZG93LlNFQ1RPUiB8fCB7fTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cclxuICAvLyBidXR0b25zIGFuaW1hdGlvblxyXG4gICQoJyNwbGF5JykuY3NzKHtcclxuICAgIGJhY2tncm91bmRTaXplOiBcImNvdmVyXCJcclxuICB9KTtcclxuXHJcblxyXG4gIGlmICgvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzX21vYmlsZScpO1xyXG4gIH1cclxuXHJcbiAgLy8g0L/Qu9C10LXRgFxyXG4gIHZhciBjdXJyZW50ID0gJCgnLnBsYXllcl9fYml0cmF0ZS1hY3RpdmUgPiAucGxheWVyX19iaXRyYXRlLW5hbWUnKSxcclxuICAgIGN1cnJlbnQgPSB7XHJcbiAgICAgIGNoYW5uZWw6IGN1cnJlbnQuZGF0YSgnY2hhbm5lbCcpLFxyXG4gICAgICBzb3VyY2U6IGN1cnJlbnQuYXR0cigncmVsJylcclxuICAgIH07XHJcblxyXG4gIHdpbmRvdy5jdXJyZW50Vm9sdW1lID0gLjc1O1xyXG5cclxuICBpbml0UGxheWVyKGN1cnJlbnQuY2hhbm5lbCwgY3VycmVudC5zb3VyY2UpO1xyXG5cclxuICB2b2x1bWVTbGlkZXIoe1xyXG4gICAgY29udGFpbmVyOiAkKCcjdm9sdW1lIC5lcXVhbGl6ZXJfX2NvbnRhaW5lci1saW5lJyksXHJcbiAgICBwb2ludDogJCgnI3ZvbHVtZSAuZXF1YWxpemVyX19jb250YWluZXItcG9pbnQnKSxcclxuICAgIHRvb2x0aXA6ICQoJyN2b2x1bWUgLnBsYXllcl9fdm9sdW1lLXNpemUnKSxcclxuICAgIGZpbGw6ICQoJyN2b2x1bWUgLmVxdWFsaXplcl9fY29udGFpbmVyLWJnJyksXHJcbiAgICBjYWxsYmFjazogZnVuY3Rpb24odm9sdW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jdXJyZW50Vm9sdW1lID0gdm9sdW1lIC8gMTAwO1xyXG4gICAgICBjaGFuZ2VWb2x1bWUodm9sdW1lKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnI3BsYXknKVxyXG4gICAgLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ3BhdXNlJykpIHtcclxuICAgICAgICBidXR0b25QbGF5KHRydWUpO1xyXG4gICAgICAgICQoXCIjanBsYXllclwiKS5qUGxheWVyKCdwbGF5Jyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uUGxheShmYWxzZSk7XHJcbiAgICAgICAgJChcIiNqcGxheWVyXCIpLmpQbGF5ZXIoJ3N0b3AnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcbiAgLy8g0LjQt9C80LXQvdC10L3QuNC1INCx0LjRgtGA0LXQudGC0LBcclxuICAkKCcjcGxheWVyLWJpdHJhdGUgLnBsYXllcl9fYml0cmF0ZS1uYW1lJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoJCh0aGlzKS5wYXJlbnQoKS5oYXNDbGFzcygnLnBsYXllcl9fYml0cmF0ZS1hY3RpdmUnKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGJpdHJhdGUgPSAkKCcjcGxheWVyLWJpdHJhdGUnKSxcclxuICAgICAgYWN0aXZlID0gYml0cmF0ZS5maW5kKCcucGxheWVyX19iaXRyYXRlLWFjdGl2ZScpLFxyXG4gICAgICB2YWx1ZSA9IHBhcnNlSW50KCQodGhpcykucHJvcCgncmVsJykpLFxyXG4gICAgICBjaGFubmVsID0gJCh0aGlzKS5kYXRhKCdjaGFubmVsJyksXHJcbiAgICAgIGN1cnJlbnRfdmFsdWUgPSBwYXJzZUludChhY3RpdmUuY2hpbGRyZW4oJ2EnKS5wcm9wKCdyZWwnKSksXHJcbiAgICAgIC8vcGVyY2VudCA9IHBhcnNlSW50KCQodGhpcykuZGF0YSgnY29sb3InKSksXHJcbiAgICAgIHBsYXllciA9ICQoXCIjanBsYXllclwiKSxcclxuICAgICAgcGxheSA9ICQoJyNwbGF5JyksXHJcbiAgICAgIHBsYXllZCA9IHBsYXkuaGFzQ2xhc3MoJ3BhdXNlJyk7XHJcblxyXG4gICAgYW5pbWF0ZUJpdHJhdGUoJCgnI2VxdWFsaXplciAuJyArIGN1cnJlbnRfdmFsdWUgKyAnaycpLCB2YWx1ZSwgKFxyXG4gICAgICBjdXJyZW50X3ZhbHVlIDwgdmFsdWUgPyAndXAnIDogJ2Rvd24nKSk7XHJcbiAgICBhY3RpdmUucmVtb3ZlQ2xhc3MoJ3BsYXllcl9fYml0cmF0ZS1hY3RpdmUnKTtcclxuICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ3BsYXllcl9fYml0cmF0ZS1hY3RpdmUnKTtcclxuICAgIC8vY2hhbmdlQ29sb3IobGlnaHRlbigkZGVmYXVsdF9jb2xvciwgcGVyY2VudCkpO1xyXG5cclxuICAgIGlmIChwbGF5ZWQpIHtcclxuICAgICAgcGxheWVyLmpQbGF5ZXIoXCJzdG9wXCIpO1xyXG4gICAgICBwbGF5LnJlbW92ZUNsYXNzKCdwYXVzZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXllci5qUGxheWVyKFwiZGVzdHJveVwiKTtcclxuICAgIGluaXRQbGF5ZXIoY2hhbm5lbCwgdmFsdWUpO1xyXG5cclxuICAgIGlmIChwbGF5ZWQpIHtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICBwbGF5LmFkZENsYXNzKCdwYXVzZScpO1xyXG4gICAgICAgICQoXCIjanBsYXllclwiKS5qUGxheWVyKCdwbGF5Jyk7XHJcbiAgICAgIH0sIDI1MClcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8g0YHQutGA0L7Qu9C70LjQvdCzXHJcbiAgLypcclxuICAkKCcjaGlzdG9yeS1ibG9jaycpXHJcbiAgICAgIC5oZWlnaHQoJCh3aW5kb3cpLmhlaWdodCgpKVxyXG4gICAgICAubUN1c3RvbVNjcm9sbGJhcih7XHJcbiAgICAgICAgICBtb3VzZVdoZWVsUGl4ZWxzOiAxMDAwLFxyXG4gICAgICAgICAgc2Nyb2xsQnV0dG9uczp7XHJcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWR2YW5jZWQ6e1xyXG4gICAgICAgICAgICAgIHVwZGF0ZU9uQnJvd3NlclJlc2l6ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB1cGRhdGVPbkNvbnRlbnRSZXNpemU6IHRydWUsXHJcbiAgICAgICAgICAgICAgbm9ybWFsaXplTW91c2VXaGVlbERlbHRhOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29udGVudFRvdWNoU2Nyb2xsOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICovXHJcblxyXG4gICQoJyN0YWJzIC5tZW51X19saXN0LWl0ZW0nKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XHJcbiAgICAkKCcjdGFicyAubWVudV9fbGlzdC1pdGVtLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICQoJyN0YWJzX2NvbnRlbnQgPiAuYWN0aXZlJylcclxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAuc2xpZGVVcCgpO1xyXG5cclxuICAgICQoJCgnI3RhYnNfY29udGVudCA+IGRpdicpW2luZGV4XSlcclxuICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAuc2xpZGVEb3duKCk7XHJcbiAgfSk7XHJcblxyXG5cclxuICAkKHdpbmRvdykuYmluZCgncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAkKCdib2R5JykuY3NzKCd3aWR0aCcsICQoZG9jdW1lbnQpLndpZHRoKCkpO1xyXG4gIH0pO1xyXG5cclxufSk7XHJcblxyXG5hbmltYXRlQml0cmF0ZSA9IGZ1bmN0aW9uKGN1cnIsIHJhdGUsIGRpcikge1xyXG4gIHZhciB1cCA9IChkaXIgPT09ICd1cCcpLFxyXG4gICAgbGVmdCA9ICh1cCA/IDAgOiAnLTIwcHgnKSxcclxuICAgIG5leHQ7XHJcblxyXG4gIGlmIChkaXIgPT09ICd1cCcpIHtcclxuICAgIG5leHQgPSBjdXJyLm5leHQoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbmV4dCA9IGN1cnIucHJldigpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCF1cCkge1xyXG4gICAgY3Vyci5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICB9XHJcbiAgY3Vyci5maW5kKCdkaXY6Zmlyc3QgPiBiJykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgbGVmdDogbGVmdFxyXG4gIH0sIDEwMCk7XHJcbiAgY3Vyci5maW5kKCdkaXY6bGFzdCcpLnN0b3AoKS5hbmltYXRlKHtcclxuICAgIGxlZnQ6IGxlZnRcclxuICB9LCAxMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHVwKSB7XHJcbiAgICAgIGN1cnIucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWN1cnIuaGFzQ2xhc3MocmF0ZSArICdrJykgJiYgISghdXAgJiYgY3Vyci5wcmV2KCkuaGFzQ2xhc3MocmF0ZSArXHJcbiAgICAgICAgJ2snKSkpIHtcclxuICAgICAgYW5pbWF0ZUJpdHJhdGUobmV4dCwgcmF0ZSwgZGlyKTtcclxuICAgIH0gLy8gZWxzZSB7XHJcbiAgICAvLyAgIGNoYW5nZUJpdHJhdGUodXApO1xyXG4gICAgLy99XHJcbiAgfSk7XHJcblxyXG59O1xyXG5cclxuLypjaGFuZ2VCaXRyYXRlID0gZnVuY3Rpb24odXApIHtcclxuICAgICQoJyNlcXVhbGl6ZXIgPiBsaScpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgY3VycmVudCA9IHBhcnNlSW50KCQodGhpcykuYXR0cignY2xhc3MnKS5yZXBsYWNlKC9zaXplKFxcZCspICguKykvLCAnJDEnKS5yZXBsYWNlKCdzaXplJywgJycpKSxcclxuICAgICAgICAgICAgY2hhbmdlID0gY3VycmVudCArICh1cD8gMTAgOiAtMTApO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50KVxyXG5cclxuICAgICAgICBpZiAoY2hhbmdlIDw9IDkwICYmIGNoYW5nZSA+IDApIHtcclxuICAgICAgICAgICAgJCh0aGlzKVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzaXplJytjdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzaXplJytjaGFuZ2UpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxufSovXHJcblxyXG5pbml0UGxheWVyID0gZnVuY3Rpb24oY2hhbm5lbCwgaWNlcykge1xyXG4gICQoXCIjanBsYXllclwiKS5qUGxheWVyKHtcclxuICAgIHZvbHVtZTogd2luZG93LmN1cnJlbnRWb2x1bWUsXHJcbiAgICByZWFkeTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICQodGhpcykualBsYXllcihcInNldE1lZGlhXCIsIHtcclxuICAgICAgICBvZ2E6IFwiaHR0cDovLzg5LjIyMy40NS41OjgwMDAvXCIgKyBjaGFubmVsICsgXCItXCIgKyBpY2VzXHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyByZWFkeSBjYWxsYmFja1xyXG4gICAgfSxcclxuICAgIHN3ZlBhdGg6IFwiaW1hZ2VzXCIsXHJcbiAgICBzdXBwbGllZDogXCJvZ2FcIlxyXG4gIH0pO1xyXG59O1xyXG5cclxuY2hhbmdlVm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XHJcbiAgJChcIiNqcGxheWVyXCIpLmpQbGF5ZXIoXCJvcHRpb25cIiwgXCJ2b2x1bWVcIiwgd2luZG93LmN1cnJlbnRWb2x1bWUpO1xyXG59O1xyXG5cclxuLypcclxuY2hlY2tUaW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKSxcclxuICAgICAgICBob3VycyA9IG5vdy5nZXRIb3VycygpLFxyXG4gICAgICAgIG5pZ2h0ID0gJyM2QTc1OEQnLFxyXG4gICAgICAgIGV2ZW5pbmcgPSAnIzIwQTBBNSc7XHJcblxyXG4gICAgaWYoaG91cnM8NyB8fCBob3Vycz4yMikge1xyXG4gICAgICAgIGNoYW5nZUNvbG9yKG5pZ2h0KTtcclxuICAgICAgICByZXR1cm4gbmlnaHQ7XHJcbiAgICB9IGVsc2UgaWYgKGhvdXJzPj03ICYmIGhvdXJzIDw9IDEyKSB7XHJcbiAgICAgICAgY2hhbmdlQ29sb3IoZXZlbmluZyk7XHJcbiAgICAgICAgcmV0dXJuIGV2ZW5pbmc7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuY2hhbmdlQ29sb3IgPSBmdW5jdGlvbihjb2xvcikge1xyXG4gICAgJCgnYm9keScpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIGNvbG9yKTtcclxuICAgIHJldHVybiBjb2xvcjtcclxufVxyXG5cclxuXHJcbmxpZ2h0ZW4gPSBmdW5jdGlvbiAoY29sb3IsIGxpZ2h0KSB7XHJcbiAgICBjb2xvciA9IGNvbG9yLnJlcGxhY2UoL1teMC05LF0rL2csIFwiXCIpO1xyXG4gICAgdmFyIHJlZCA9IGNvbG9yLnNwbGl0KFwiLFwiKVswXTtcclxuICAgIHZhciBncmUgPSBjb2xvci5zcGxpdChcIixcIilbMV07XHJcbiAgICB2YXIgYmx1ID0gY29sb3Iuc3BsaXQoXCIsXCIpWzJdO1xyXG5cclxuICAgIHZhciBoc3YgPSBSZ2JUb0hzdihyZWQsZ3JlLGJsdSk7XHJcbiAgICB2YXIgcmdiID0gSHN2VG9SZ2IoaHN2LmgsIGhzdi5zLCBsaWdodCk7XHJcblxyXG4gICAgcmV0dXJuIFwicmdiKFwiICsgcmdiLnIgKyBcIixcIiArIHJnYi5nICsgXCIsXCIgKyByZ2IuYiArIFwiKVwiO1xyXG59XHJcbiovXHJcblxyXG5cclxuXHJcbmJ1dHRvblBsYXkgPSBmdW5jdGlvbigkcGxheSkge1xyXG4gICQoJyNwbGF5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgd2lkdGg6ICc3MHB4JyxcclxuICAgIGhlaWdodDogJzcwcHgnLFxyXG4gICAgdG9wOiAnNXB4JyxcclxuICAgIGxlZnQ6ICc1cHgnXHJcbiAgfSwgNTAsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCRwbGF5KVxyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdwYXVzZScpO1xyXG4gICAgZWxzZVxyXG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdwYXVzZScpO1xyXG4gICAgJCh0aGlzKS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgIHdpZHRoOiAnODBweCcsXHJcbiAgICAgIGhlaWdodDogJzgwcHgnLFxyXG4gICAgICB0b3A6IDAsXHJcbiAgICAgIGxlZnQ6IDBcclxuICAgIH0sIDcwLCAnZWFzZU91dENpcmMnKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5mdW5jdGlvbiBSZ2JUb0hzdihyLCBnLCBiKSB7XHJcbiAgICB2YXIgbWluID0gTWF0aC5taW4ociwgZywgYiksXHJcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXHJcbiAgICAgICAgZGVsdGEgPSBtYXggLSBtaW4sXHJcbiAgICAgICAgaCwgcywgdiA9IG1heDtcclxuXHJcbiAgICB2ID0gTWF0aC5mbG9vcihtYXggLyAyNTUgKiAxMDApO1xyXG4gICAgaWYgKG1heCA9PSAwKSByZXR1cm4gWzAsIDAsIDBdO1xyXG4gICAgcyA9IE1hdGguZmxvb3IoZGVsdGEgLyBtYXggKiAxMDApO1xyXG4gICAgdmFyIGRlbHRhZGl2ID0gZGVsdGEgPT0gMCA/IDEgOiBkZWx0YTtcclxuICAgIGlmKCByID09IG1heCApIGggPSAoZyAtIGIpIC8gZGVsdGFkaXY7XHJcbiAgICBlbHNlIGlmKGcgPT0gbWF4KSBoID0gMiArIChiIC0gcikgLyBkZWx0YWRpdjtcclxuICAgIGVsc2UgaCA9IDQgKyAociAtIGcpIC8gZGVsdGFkaXY7XHJcbiAgICBoID0gTWF0aC5mbG9vcihoICogNjApO1xyXG4gICAgaWYoIGggPCAwICkgaCArPSAzNjA7XHJcbiAgICByZXR1cm4geyBoOiBoLCBzOnMsIHY6diB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEhzdlRvUmdiKGgsIHMsIHYpIHtcclxuICAgIGggPSBoIC8gMzYwO1xyXG4gICAgcyA9IHMgLyAxMDA7XHJcbiAgICB2ID0gdiAvIDEwMDtcclxuXHJcbiAgICBpZiAocyA9PSAwKVxyXG4gICAge1xyXG4gICAgICAgIHZhciB2YWwgPSBNYXRoLnJvdW5kKHYgKiAyNTUpO1xyXG4gICAgICAgIHJldHVybiB7cjp2YWwsZzp2YWwsYjp2YWx9O1xyXG4gICAgfVxyXG4gICAgaFBvcyA9IGggKiA2O1xyXG4gICAgaFBvc0Jhc2UgPSBNYXRoLmZsb29yKGhQb3MpO1xyXG4gICAgYmFzZTEgPSB2ICogKDEgLSBzKTtcclxuICAgIGJhc2UyID0gdiAqICgxIC0gcyAqIChoUG9zIC0gaFBvc0Jhc2UpKTtcclxuICAgIGJhc2UzID0gdiAqICgxIC0gcyAqICgxIC0gKGhQb3MgLSBoUG9zQmFzZSkpKTtcclxuICAgIGlmIChoUG9zQmFzZSA9PSAwKSB7cmVkID0gdjsgZ3JlZW4gPSBiYXNlMzsgYmx1ZSA9IGJhc2UxfVxyXG4gICAgZWxzZSBpZiAoaFBvc0Jhc2UgPT0gMSkge3JlZCA9IGJhc2UyOyBncmVlbiA9IHY7IGJsdWUgPSBiYXNlMX1cclxuICAgIGVsc2UgaWYgKGhQb3NCYXNlID09IDIpIHtyZWQgPSBiYXNlMTsgZ3JlZW4gPSB2OyBibHVlID0gYmFzZTN9XHJcbiAgICBlbHNlIGlmIChoUG9zQmFzZSA9PSAzKSB7cmVkID0gYmFzZTE7IGdyZWVuID0gYmFzZTI7IGJsdWUgPSB2fVxyXG4gICAgZWxzZSBpZiAoaFBvc0Jhc2UgPT0gNCkge3JlZCA9IGJhc2UzOyBncmVlbiA9IGJhc2UxOyBibHVlID0gdn1cclxuICAgIGVsc2Uge3JlZCA9IHY7IGdyZWVuID0gYmFzZTE7IGJsdWUgPSBiYXNlMn07XHJcblxyXG4gICAgcmVkID0gTWF0aC5yb3VuZChyZWQgKiAyNTUpO1xyXG4gICAgZ3JlZW4gPSBNYXRoLnJvdW5kKGdyZWVuICogMjU1KTtcclxuICAgIGJsdWUgPSBNYXRoLnJvdW5kKGJsdWUgKiAyNTUpO1xyXG4gICAgcmV0dXJuIHtyOnJlZCxnOmdyZWVuLGI6Ymx1ZX07XHJcbn1cclxuKi9cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2Fzc2V0cy9zY3JpcHRzL2NvbW1vbi5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIihmdW5jdGlvbiAoU0VDVE9SKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHByb2dyZXNzID0ge1xyXG5cclxuICAgICAgICAvKiAgVXNlIGFwaSBpbnN0ZWFkIG9mIHBsYXl0aW1lLmpzb24sIHdoZXJlOlxyXG4gICAgICAgICAgICB0aW1lc3RhbXAgLSBjdXJyZW50IHNlcnZlciB0aW1lc3RhbXAsIHVuaXh0aW1lIChub3RlIHRoYXQganMgbmVlZCAxMDAwIG11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgIHNlcnZlclRpbWUgLSBzZXJ2ZXIgdGltZSB3aGVuIHRyYWNrIHdhcyBzdGFydGVkIHBsYXlpbmcsIHVuaXh0aW1lXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLy9hcGlQb2ludDogJ2h0dHA6Ly9zZWN0b3JyYWRpby5ydS9hcGkvdHJhY2sucGhwJyxcclxuXHJcbiAgICAgICAgdGltZXI6IHt9LFxyXG4gICAgICAgIGFwaVByb21pc2U6IHt9LFxyXG4gICAgICAgIHVybDogJ2h0dHA6Ly9zZWN0b3JyYWRpby5ydS9hcGkvdHJhY2sucGhwJyxcclxuICAgICAgICBuZWVkVXBkYXRlOiBmYWxzZSxcclxuICAgICAgICB1cGRhdGVUaW1lb3V0OiAwLFxyXG5cclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2FudmFzKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXJsICs9ICc/JyArIERhdGUubm93KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0UGxheXRpbWUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgIGFkZENhbnZhczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGNucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyJyk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoY25zLCBjb250YWluZXIuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgICAgIGNucy5pZCA9ICdwcm9ncmVzcy1iYXInO1xyXG4gICAgICAgIGNucy5oZWlnaHQgPSAnMTQwJztcclxuICAgICAgICBjbnMud2lkdGggPSAnMTQwJztcclxuICAgICAgICBjbnMuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgY25zLnN0eWxlLnRvcCA9IFwiNTBweFwiO1xyXG4gICAgICAgIGNucy5zdHlsZS5sZWZ0ID0gXCI1MCVcIjtcclxuICAgICAgICBjbnMuc3R5bGUubWFyZ2luTGVmdCA9IFwiLTcwcHhcIjtcclxuICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIHN0YXJ0UmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckJhcigpO1xyXG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpLCA2Nik7XHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIGdldFBsYXl0aW1lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aGlzLmFwaVByb21pc2UgPSBmZXRjaCh0aGlzLnVybClcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50aW1lciA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgdGhpcy5zdGFydFJlbmRlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgcmVuZGVyQmFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBub3cgLSB0aGlzLnRpbWVyLnNlcnZlclRpbWUgKiAxMDAwO1xyXG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBjdXJyZW50VGltZSAvICh0aGlzLnRpbWVyLmxlbmd0aCAqIDEwMDApO1xyXG4gICAgICAgICAgICB2YXIgY25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2dyZXNzLWJhcicpO1xyXG4gICAgICAgICAgICB2YXIgY3R4ID0gY25zLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIDE0MCwgMTQwKTtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZSg3MCwgNzApO1xyXG4gICAgICAgICAgICBjdHgucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAxMTtcclxuICAgICAgICAgICAgY3R4LmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcblxyXG4gICAgICAgICAgICB3cml0ZVRpbWUoY3R4KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHdyaXRlVGltZShjdHgpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIC41NSknO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgcGFydGlhbENpcmNsZShjdHgsIDAsIDAsIDU0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zY2FsZSgxLCAxKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHBhcnRpYWxDaXJjbGUoY3R4LCB4LCB5LCByYWQpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmMoeCwgeSwgcmFkLCAwLCBwcm9ncmVzcyAqIChNYXRoLlBJICogMiksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjdHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyA+IDEpIHtcclxuICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheXRpbWUodGhpcy51cGRhdGVUaW1lb3V0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWVvdXQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgIHVwZGF0ZVBsYXl0aW1lOiBmdW5jdGlvbiAodGltZSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHRoaXMuZ2V0UGxheXRpbWUoKTtcclxuICAgICAgICB9KS5iaW5kKHRoaXMpLCB0aW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lb3V0ID0gMzAwMDtcclxuICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgLy8gVE9ETyBtYWtlIG1vZHVsZSB1cGRhdGVTdGF0dXMgZnJvbSBjb21tb24uanMgYW5kIHJlcXVlc3Qgbm93cGxheWluZyBvbmx5IHdoZW4gdGltZXIgaXMgcmVhZHlcclxuICAgIFNFQ1RPUi5wcm9ncmVzcyA9IHByb2dyZXNzLmluaXQoKTtcclxuXHJcbn0pKHdpbmRvdy5TRUNUT1IpO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXNzZXRzL3NjcmlwdHMvcHJvZ3Jlc3NiYXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ3aW5kb3cucHJvZ3JhbUFjdGl2ZSA9IHtcclxuICByb3dzOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwcm9ncmFtc19fcm93JyksXHJcblxyXG4gIGJyZWFrUG9pbnRzOiBbXSxcclxuXHJcbiAgdGltZToge30sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc2V0QnJlYWtwb2ludHMoKTtcclxuICAgIHRoaXMuZ2V0VGltZXpvbmUoKTtcclxuICB9LFxyXG5cclxuICBzZXRCcmVha3BvaW50czogZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5icmVha1BvaW50cy5wdXNoKE51bWJlcih0aGlzLnJvd3NbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXRpbWUnKSkpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGdldFRpbWV6b25lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBTRUNUT1IucHJvZ3Jlc3MuYXBpUHJvbWlzZVxyXG4gICAgICAudGhlbigoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB0aGlzLnNlcnZlclRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNlcnZlclRpbWUoKTtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB0aGlzLnNlcnZlclRpbWUgKz0gMTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlU2VydmVyVGltZSgpO1xyXG4gICAgICAgIH0pLmJpbmQodGhpcyksIDEwMDApO1xyXG5cclxuICAgICAgICB0aGlzLnNldFVwZGF0ZUludGVydmFsKDApO1xyXG4gICAgICB9KS5iaW5kKHRoaXMpKTtcclxuICB9LFxyXG5cclxuICB1cGRhdGVTZXJ2ZXJUaW1lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnRpbWUubm93ID0gbmV3IERhdGUodGhpcy5zZXJ2ZXJUaW1lKjEwMDApO1xyXG4gICAgdGhpcy50aW1lLmhvdXJzID0gdGhpcy50aW1lLm5vdy5nZXRIb3VycygpO1xyXG4gICAgdGhpcy50aW1lLm1pbnV0ZXMgPSB0aGlzLnRpbWUubm93LmdldE1pbnV0ZXMoKTtcclxuICAgIHRoaXMudGltZS5zZWNvbmRzID0gdGhpcy50aW1lLm5vdy5nZXRTZWNvbmRzKCk7XHJcbiAgICB0aGlzLnRpbWUubW9zY293SG91cnMgPSAoKHRoaXMudGltZS5ob3VycyArIHRoaXMudGltZS5ub3cuZ2V0VGltZXpvbmVPZmZzZXQoKS82MCkgKyAzKTtcclxuICB9LFxyXG5cclxuICBnZXRCcmVha3BvaW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy50aW1lLm1vc2Nvd0hvdXJzICUgMikge1xyXG4gICAgICB0aGlzLm5leHRCcmVha3BvaW50SW4gPSAoNjAgLSB0aGlzLnRpbWUuc2Vjb25kcykgKiAxMDAwICsgKDExOSAtIHRoaXMudGltZS5taW51dGVzKSAqIDYwICogMTAwMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubmV4dEJyZWFrcG9pbnRJbiA9ICg2MCAtIHRoaXMudGltZS5zZWNvbmRzKSAqIDEwMDAgKyAoNTkgLSB0aGlzLnRpbWUubWludXRlcykgKiA2MCAqIDEwMDA7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0QWN0aXZlUm93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy50aW1lLm1vc2Nvd0hvdXJzICUgMikge1xyXG4gICAgICB0aGlzLmFjdGl2ZVJvdyA9IHRoaXMuYnJlYWtQb2ludHMuaW5kZXhPZih0aGlzLnRpbWUubW9zY293SG91cnMpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlUm93ID0gdGhpcy5icmVha1BvaW50cy5pbmRleE9mKHRoaXMudGltZS5tb3Njb3dIb3VycyAtIDEpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHNldFVwZGF0ZUludGVydmFsOiBmdW5jdGlvbiAodGltZSkge1xyXG4gICAgc2V0VGltZW91dCgoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGltZSkge1xyXG4gICAgICAgIHRoaXNcclxuICAgICAgICAgIC5yb3dzW3RoaXMuYWN0aXZlUm93XVxyXG4gICAgICAgICAgLmNsYXNzTGlzdFxyXG4gICAgICAgICAgLnRvZ2dsZSgncHJvZ3JhbXNfX3Jvdy1hY3RpdmUnKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdGhpcy5nZXRBY3RpdmVSb3coKTtcclxuICAgICAgdGhpc1xyXG4gICAgICAgIC5yb3dzW3RoaXMuYWN0aXZlUm93XVxyXG4gICAgICAgIC5jbGFzc0xpc3RcclxuICAgICAgICAudG9nZ2xlKCdwcm9ncmFtc19fcm93LWFjdGl2ZScpO1xyXG5cclxuICAgICAgdGhpcy5nZXRCcmVha3BvaW50KCk7XHJcbiAgICAgIGlmIChOT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uZXh0QnJlYWtwb2ludEluKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNldFVwZGF0ZUludGVydmFsKHRoaXMubmV4dEJyZWFrcG9pbnRJbik7XHJcbiAgICB9KS5iaW5kKHRoaXMpLCB0aW1lKTtcclxuICB9XHJcbn07XHJcblxyXG5wcm9ncmFtQWN0aXZlLmluaXQoKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vYXNzZXRzL3NjcmlwdHMvcHJvZ3JhbUFjdGl2ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=