(function (SECTOR) {
    'use strict';

    var progress = {

        //apiPoint: '/api/track.php',
        apiPoint: 'http://sectorradio.ru/api/track.php',

        byId: 'player',
        trackId: 'track-loader',

        trackInfo: {},
        channel: '',

        init: function () {
            this.channel = document.getElementById(this.trackId).dataset.channel;

            this.addCanvas()
                .updateStatus();

            return this;
        },

        updateStatus: function() {
            this.getPlaytime(
                function(data) {
                    this.trackInfo = data;
                    // local time when json was parsed
                    this.trackInfo.timeLocal = Date.now();
                    // difference between local and server time, ms
                    this.trackInfo.timeDelta = this.trackInfo.timeLocal - this.trackInfo.timestamp*1000;
                    // played time with server timers
                    this.trackInfo.serverPlayed = this.trackInfo.timestamp - this.trackInfo.serverTime;
                    //console.log( 'Server played, s: ' + this.trackInfo.serverPlayed);
                    //console.log( 'Local/Server time delta, ms: ' + this.trackInfo.timeDelta );
                    this.startRender();
                    if ( SECTOR.status ) {
                        SECTOR.status.updateTrackInfo();
                    }
                });
        },

        addCanvas: function() {
            var canvas = document.createElement('canvas'),
                player = document.getElementById(this.byId),
                first = player.children[0];

            player.insertBefore(canvas, first);
            canvas.style.position = "absolute";
            canvas.style.top = "50px";
            canvas.style.left = "50%";
            canvas.style.marginLeft = "-70px";
            canvas.style.width = "300px";
            canvas.style.height = "150px";
            this.canvas = canvas;

            return this;
        },


        startRender: function () {
            this.interval = setInterval((function() {
                this.renderBar();
            }).bind(this), 66);
        },


        // TODO use fetch with polyfill for this
        getPlaytime: function (callback) {
            this.url = this.apiPoint + '?channel=' + this.channel + '&rnd=' + Date.now();

            var xhr = new XMLHttpRequest(),
                data;

            function xhrReady() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    callback.bind(this)(data);
                }
            }

            xhr.onreadystatechange = xhrReady.bind(this);
            xhr.open("GET", this.url, true);
            xhr.send();

            return this;

        },


        renderBar: function () {
            var diff = (Date.now() - this.trackInfo.timeLocal)/1000,
                progress = (diff + this.trackInfo.serverPlayed) / this.trackInfo.length;

            //console.log( 'Played local, s: ' + diff );
            //console.log( 'Progress: ' + progress );

            if ( progress > 1 ) {
                clearInterval(this.interval);
                if ( this.updateTimeout ) {
                    return;
                }
                this.updateTimeout = setTimeout(this.updateData.bind(this), 500);
                return;
            }

            var ctx = this.canvas.getContext('2d');

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
        },


        updateData: function() {
            this.updateTimeout = false;
            this.updateStatus();
        }

    };

    // TODO make module updateStatus from common.js and request nowplaying only when timer is ready
    SECTOR.progress = progress.init();

})(window.SECTOR);
