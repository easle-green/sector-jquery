'use strict';

function api() {
    var EventEmitter = require('wolfy87-eventemitter');

    return {
        apiPoint: '//sectorradio.ru/api/track.php',
        trackId: 'track-loader',
        channel: 'progressive',
        trackInfo: {},

        init: function () {
            this.channel = document.getElementById(this.trackId).dataset.channel || this.channel;
            this.requestEmitter = new EventEmitter();
            this.update();

            return this;
        },

        update: function() {
            this.url = this.apiPoint + '?channel=' + this.channel + '&rnd=' + Date.now();

            var xhr = new XMLHttpRequest(),
              data;

            function xhrReady() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    this.calcTimers(data);
                }
            }

            xhr.onreadystatechange = xhrReady.bind(this);
            xhr.open("GET", this.url, true);
            xhr.send();

            return this;
        },

        calcTimers: function(request) {
            this.trackInfo = request;
            // local time when json was parsed
            this.trackInfo.timeLocal = Date.now();
            // difference between local and server time, ms
            this.trackInfo.timeDelta = this.trackInfo.timeLocal - this.trackInfo.timestamp*1000;
            // played time with server timers
            this.trackInfo.serverPlayed = this.trackInfo.timestamp - this.trackInfo.serverTime;
            //console.log( 'Server played, s: ' + this.trackInfo.serverPlayed);
            //console.log( 'Local/Server time delta, ms: ' + this.trackInfo.timeDelta );

            this.requestEmitter.emitEvent('requestReady');

            var now = Date.now(),
              diff = ( now - this.trackInfo.timeLocal )/1000,
              currentProgress = ( diff + this.trackInfo.serverPlayed ) / this.trackInfo.length,
              timeLeft = this.trackInfo.length - this.trackInfo.serverPlayed,
              timer;

            //console.log( 'Server time left, s: ', timeLeft );

            if ( currentProgress < 1 ) {
                timer = timeLeft*1000;
            } else {
                timer = 3000;
            }

            this.timeout = setTimeout(this.update.bind(this), timer);
        }

    };
}

module.exports = api;

