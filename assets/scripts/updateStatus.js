(function (SECTOR) {
    'use strict';

    var status = {

        byId: 'track-loader',
        byArtist: '.player__title',
        byTitle: '.player__trackname',

        init: function () {
            this.block = document.getElementById(this.byId);
            this.channel = this.block.dataset.channel;

            return this;
        },

        updateTrackInfo: function() {
            this.trackInfo = SECTOR.progress.trackInfo;
            this.setTrackHTML();
        },

        setTrackHTML: function() {
            this.block.querySelector(this.byArtist).innerText = this.trackInfo.artist.replace(/'\\/gi, '');
            this.block.querySelector(this.byTitle).innerText = this.trackInfo.title.replace(/'\\/gi, '');
        }

    };

    SECTOR.status = status.init();

})(window.SECTOR);
