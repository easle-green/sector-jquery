(function (SECTOR) {
    'use strict';

    var progress = {

        /*  Use api instead of playtime.json, where:
            timestamp - current server timestamp, unixtime (note that js need 1000 multiplier)
            serverTime - server time when track was started playing, unixtime
         */
        //apiPoint: 'http://sectorradio.ru/api/track.php',

        timer: {},
        url: 'http://sectorradio.ru/api/track.php',
        needUpdate: false,
        updateTimeout: 0,

        init: function () {
            this.addCanvas();
            this.url += '?' + Date.now();
            this.getPlaytime();
            return this;
        },

      getPlaytime: function (){
        this.getData(function(data) {
          this.timer = data;
          // make calculations using json serverTime and timestamp there
          this.startRender();
        });
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


        getData: function (callback) {
            var xhr = new XMLHttpRequest(),
                data;

            function xhrReady() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    callback.bind(this)(data);
                }
            }

            xhr.onreadystatechange = xhrReady.bind(this);
            xhr.open("GET", this.url, true); // async
            xhr.send();

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
