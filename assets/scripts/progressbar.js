(function (SECTOR) {
    'use strict';

    var progress = {

        byId: 'player',

        init: function () {
            SECTOR.api.requestEmitter.addListener('requestReady', this.startRender.bind(this));

            this.addCanvas()
                .startRender();

            return this;
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
            this.interval = setInterval(this.renderBar.bind(this), 66);
        },

        renderBar: function () {
            var trackInfo = SECTOR.api.trackInfo,
                diff = (Date.now() - trackInfo.timeLocal)/1000,
                progress = (diff + trackInfo.serverPlayed) / trackInfo.length;

            //console.log( 'Played local, s: ' + diff );
            //console.log( 'Progress: ' + progress );

            if ( progress > 1 ) {
                clearInterval(this.interval);
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
        }

    };

    SECTOR.progress = progress.init();

})(window.SECTOR);
