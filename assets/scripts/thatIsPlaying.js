(function () {
    'use strict';

    var playing = {

        timer: {},
        url: 'http://sectorradio.ru/api/track.php',

        init: function () {
            var track = document.getElementById('track-loader');

            this.playerTitle = track.querySelector('.player__title');
            this.playerTrack = track.querySelector('.player__trackname');

            this.updateStatus();
        },

        writeStatus: function () {
            this.playerTitle.innerText = this.timer.artist;
            this.playerTrack.innerText = this.timer.title;
        },

        updateStatus: function () {
            var xhr = new XMLHttpRequest(),
                data;

            function xhrReady() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    this.timer = data;
                    this.writeStatus.bind(this)(data);
                    this.considersTime();
                }
            }

            xhr.onreadystatechange = xhrReady.bind(this);
            xhr.open("GET", this.url + '?' + Date.now(), true);
            xhr.send();
        },

        considersTime: function () {
            var lengthTrack = this.timer.length,
                whatTimeStamp = this.timer.timestamp,
                whatServerTime = this.timer.serverTime,
                timeLeft = (lengthTrack + whatTimeStamp - whatServerTime) * 1000;

            if (timeLeft <= 0) {
                timeLeft = 3000;
            }

            setTimeout(this.updateStatus.bind(this), timeLeft);
            
        }
    };

    playing.init();
})();
