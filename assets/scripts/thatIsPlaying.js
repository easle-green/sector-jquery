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
            // TODO Use XMLHttpRequest for this.
            // Do not copy-paste from progressbar.js for new module, make only one xhr function for both
            // $.get(
            //     //'/nowplaying-' + $('#track-loader').data('channel') + '.txt?' + Date.now(),
            //     '/track.json?' + Date.now(),
            //     function (info) {
            //         track.querySelector('.player__title').innerText = info.artist;
            //         track.querySelector('.player__trackname').innerText = info.title;
            //     }
            // )
            var xhr = new XMLHttpRequest(),
                data;

            function xhrReady() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    this.timer = data;
                    this.writeStatus.bind(this)(data);
                    this.considersTime();
                    console.log('11');
                }
            }

            xhr.onreadystatechange = xhrReady.bind(this);
            xhr.open("GET", this.url + '?' + Date.now(), true); // async
            xhr.send();
        },

        considersTime: function () {
            var lengthTrack = this.timer.length,
                whatTimeStamp = this.timer.timestamp,
                whatServerTime = this.timer.serverTime,
                timeLeft = (lengthTrack + whatTimeStamp - whatServerTime) * 1000;
            console.log('длина =',lengthTrack,'старт =',whatTimeStamp,'время на сервере',whatServerTime);
            console.log('+-',lengthTrack + whatTimeStamp - whatServerTime,timeLeft);

            if (timeLeft <= 0) {
                console.log('я в if');
                setTimeout(this.updateStatus.bind(this), 3000);
            } else {
                console.log('я в else');
                setTimeout(this.updateStatus.bind(this), timeLeft);
            }



        }
    };

    playing.init();
})();
