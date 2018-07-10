'use strict';

function slider() {

    var volumeSlider = function (opts) {

        var isMouseDown = false,
            upperBound = (opts.container.height() - opts.point.height()),
            currentVal = 0,
            currentFill = 0,
            startMouseY,
            lastElemTop;

        var startSlide = function (e) {
            if ( SECTOR.historyOpened() ) {
                return;
            }

            isMouseDown = true;
            var pos = getMousePosition(e);
            startMouseY = pos.y;
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
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            return {'x': posx, 'y': posy};
        };

        var updatePosition = function (e) {
            var pos = getMousePosition(e);
            var spanY = (pos.y - startMouseY);
            var newPos = (lastElemTop + spanY);

            newPos = Math.max(0, newPos);
            newPos = Math.min(newPos, upperBound);
            currentVal = Math.round((newPos / upperBound) * 100);
            currentFill = upperBound - newPos + opts.point.height() / 2;

            opts.point.css("top", newPos);
            opts.fill.css("height", currentFill);
            opts.tooltip.html(100 - currentVal);
            opts.callback((100 - currentVal)/100);
        };

        SECTOR.updatePositionByVolume = function(volume) {
            const position = Math.round((100 - volume * 100) / 100 * upperBound);

            opts.point.css("top", position);
            opts.fill.css("height", upperBound - position + opts.point.height() / 2);
            opts.tooltip.html(Math.round(volume*100));
        };

        var moving = function (e) {
            if (isMouseDown) {
                updatePosition(e);
                return false;
            }
        };

        var dropCallback = function () {
            isMouseDown = false;
            opts.point.removeClass('moving');

            const volume = (100 - currentVal) / 100;
            SECTOR.currentVolume = volume;
            localStorage.setItem('volume', volume);
        };

        opts.point.bind('mousedown', startSlide);

        $(document).mousemove(function (e) {
            moving(e);
            if (isMouseDown) {
                opts.point.addClass('moving');
            }
        });

        $(document).mouseup(function (e) {
            if ( !isMouseDown ) {
                return;
            }
            dropCallback();
        });

    };

    return volumeSlider({
        container: $('#volume .equalizer__container-line'),
        point: $('#volume .equalizer__container-point'),
        tooltip: $('#volume .player__volume-size'),
        fill: $('#volume .equalizer__container-bg'),
        callback: SECTOR.changeVolume
    });
}

module.exports = slider;

