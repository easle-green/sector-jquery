function status (SECTOR) {
    'use strict';

    return {

        byId: 'track-loader',
        byArtist: '.player__title',
        byTitle: '.player__trackname',
        byConnected: 'connected',
        byHistory: '#history .simplebar-content',

        currentArtist: '',
        currentTitle: '',

        init: function () {
            this.block = document.getElementById(this.byId);

            SECTOR.api.requestEmitter.addListener('requestReady', this.setTrackHTML.bind(this));

            return this;
        },

        setTrackHTML: function() {
            var trackInfo = SECTOR.api.trackInfo;
            this.currentArtist = trackInfo.artist.replace(/'\\/gi, '');
            this.currentTitle = trackInfo.title.replace(/'\\/gi, '');

            this.block.querySelector(this.byArtist).innerText = this.currentArtist;
            this.block.querySelector(this.byTitle).innerText = this.currentTitle;

            document.getElementById(this.byConnected).innerText = trackInfo.connected;
            // this.insertHistory();
        },

        insertHistory: function() {
            const history = document.querySelector(this.byHistory);
            const el = document.createElement('div');
            el.innerHTML = `
                <time>${SECTOR.api.trackInfo.serverTime}</time>
                <div class="history-track-name"><strong>${this.currentArtist}</strong> — ${this.currentTitle}</div>
            `;
            history.insertBefore(el, history.firstChild);
        }

    }

}

module.exports = status;