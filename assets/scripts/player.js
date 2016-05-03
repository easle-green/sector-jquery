window.player = {
    trackArtist: '',
    trackTitle: '',

    init: function() {
        var current = this.track();
        this.trackArtist = current[0];
        this.trackTitle = current[1];
    },

    track: function() {
        return [$('#track-loader .title').text(), $('#track-loader .trackname').text()];
    },

    checkTrack: function () {
        var current = this.track();
        if (this.trackArtist != current[0] && this.trackTitle != current[1]) {
            this.init();
            this.addTrack();
        }
    },

    addTrack: function () {
        var tpl_track = $('#history .history-block > div:first').clone(),
            tpl_date = $('#history .history-block > .delimiter:first').clone(),
            appendix = $('#history .history-block > .delimiter:first');

        var today = new Date(),
            dd = today.getDate() < 10 ? "0" + today.getDate() : today.getDate(),
            mm = today.getMonth() + 1,
            hh = today.getHours() < 10 ? "0" + today.getHours() : today.getHours(),
            min = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();


        tpl_track
            .insertAfter(appendix)
            .find('time')
                .text(hh + ":" + min)
            .parent().find('div')
                .html("<strong>" + this.trackArtist + "</strong> &mdash; " + this.trackTitle);
    }
};

$(document).ready(function() {
    player.init();
});
