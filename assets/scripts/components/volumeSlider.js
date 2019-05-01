'use strict';

function slider(SECTOR) {

    var opts = {
        container: $('#volume .equalizer__container-line'),
        point: $('#volume .equalizer__container-point'),
        tooltip: $('#volume .player__volume-size'),
        fill: $('#volume .equalizer__container-bg')
    };

    var slider = {
        isMouseDown: false,
        upperBound: 0,
        currentVal: 0,
        currentFill: 0,
        startMouseY: 0,
        lastElemTop: '',

        init: function() {
            this.upperBound = (opts.container.height() - opts.point.height());

            opts.point[0].addEventListener('mousedown', this.startSlide.bind(this));
            document.addEventListener('mousemove', this.trackMove.bind(this));
            document.addEventListener('mouseup', this.stopMove.bind(this));
        },

        trackMove: function (e) {
            if (!this.isMouseDown) {
                return;
            }
            this.moving(e);
            opts.point.addClass('moving');
        },

        stopMove: function () {
            if ( !this.isMouseDown ) {
                return;
            }
            this.dropCallback();
        },

        startSlide: function (e) {
            if ( SECTOR.historyOpened() ) {
                return;
            }

            this.isMouseDown = true;
            var pos = this.getMousePosition(e);
            this.startMouseY = pos.y;
            this.lastElemTop = e.target.offsetTop;
            this.updatePosition(e);

            return false;
        },

        getMousePosition: function (e) {
            //container.animate({ scrollTop: rowHeight }, options.scrollSpeed, 'linear', ScrollComplete());
            var posx = 0;
            var posy = 0;

            if (!e) {
                e = window.event;
            }

            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            return {'x': posx, 'y': posy};
        },

        updatePosition: function (e) {
            var pos = this.getMousePosition(e);
            var spanY = (pos.y - this.startMouseY);
            var newPos = (this.lastElemTop + spanY);

            newPos = Math.max(0, newPos);
            newPos = Math.min(newPos, this.upperBound);
            this.currentVal = Math.round((newPos / this.upperBound) * 100);
            this.currentFill = this.upperBound - newPos + opts.point.height() / 2;

            opts.point.css("top", newPos);
            opts.fill.css("height", this.currentFill);
            opts.tooltip.html(100 - this.currentVal);
            SECTOR.changeVolume((100 - this.currentVal)/100);
        },

        moving: function (e) {
            if (!this.isMouseDown) {
                return;
            }
            this.updatePosition(e);
            return false;
        },

        dropCallback: function () {
            this.isMouseDown = false;
            opts.point.removeClass('moving');

            var volume = (100 - this.currentVal) / 100;

            SECTOR.currentVolume = volume;
            localStorage.setItem('volume', volume);
        }
    };

    SECTOR.updatePositionByVolume = function(volume) {
        var position = Math.round((100 - volume * 100) / 100 * slider.upperBound);

        opts.point.css("top", position);
        opts.fill.css("height", slider.upperBound - position + opts.point.height() / 2);
        opts.tooltip.html(Math.round(volume*100));
    };

    return slider;

}

module.exports = slider;
