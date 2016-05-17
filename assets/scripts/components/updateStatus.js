function status (SECTOR) {
    'use strict';

    return {

        byId: 'track-loader',
        byArtist: '.player__title',
        byTitle: '.player__trackname',

        init: function () {
            this.block = document.getElementById(this.byId);

            SECTOR.api.requestEmitter.addListener('requestReady', this.setTrackHTML.bind(this));

            return this;
        },

        setTrackHTML: function() {
            var trackInfo = SECTOR.api.trackInfo;
            this.block.querySelector(this.byArtist).innerText = trackInfo.artist.replace(/'\\/gi, '');
            this.block.querySelector(this.byTitle).innerText = trackInfo.title.replace(/'\\/gi, '');

            document.getElementById('connected').innerText = trackInfo.connected;
        }

    }

}

module.exports = status;