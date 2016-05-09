(function (SECTOR) {
    'use strict';

    var progress = {

        /*  Use api instead of playtime.json, where:
            timestamp - current server timestamp, unixtime (note that js need 1000 multiplier)
            serverTime - server time when track was started playing, unixtime
         */
        //apiPoint: 'http://sectorradio.ru/api/track.php',

        timer: {},
        url: 'playtime.json',

        init: function () {
            this.url += '?' + Date.now();

            // move to new func
            this.getPlaytime( function(data) {
                this.timer = data;
                // make calculations using json serverTime and timestamp there
                this.startRender();
            });

            return this;
        },


        startRender: function () {
            setInterval((function() {
                this.renderBar();
            }).bind(this), 66);
        },


        getPlaytime: function (callback) {
            var xhr = new XMLHttpRequest(),
                data;

            function xhrReady() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    // for local debug, you can delete it
                    //data = {
                    //    "serverTime": Date.now(),
                    //    "length": "60"
                    //};

                    callback.bind(this)(data);
                }
            }

            xhr.onreadystatechange = xhrReady.bind(this);
            xhr.open("GET", this.url, true); // async
            xhr.send();

        },


        renderBar: function () {
            var now = new Date();
            // make calculations using server played time and local timings
            var currentTime = now - this.timer.serverTime;
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

            // 1. no reason to apply styles forever while renderBar calls
            // 2. append canvas element from javascript
            // 3. move to
            cns.style.position = "absolute";
            cns.style.top = "50px";
            cns.style.left = "50%";
            cns.style.marginLeft = "-70px";

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
        }

    };

    // TODO make module updateStatus from common.js and request nowplaying only when timer is ready
    SECTOR.progress = progress.init();

})(window.SECTOR);
