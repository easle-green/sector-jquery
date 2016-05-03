(function (global) {

    "use strict";

    var $       = global.jQuery,
        console = global.console,
        ga      = global._gaq;

    window.track_js = {

        submit_status:  false,
        debug:          true,

        /**
         *  Отправка события в Google Analytics.
         *
         *  @param {String} page
         *      страница, на которой возникло событие
         *  @param {String} event
         *      тип события
         *  @poram {String} description
         *      описание события
         */
        event: function (page, ev, description) {
            if (this.debug) {
                console.warn('Event: ' + description);
            }

            if (ga === undefined) {
                return;
            }

            ga.push(['_trackEvent', page, ev, description]);
        },

        /**
         *  Отправка события о просмотре страницы в Google Analytics.
         *
         *  @param {String} page
         *      просмотренная страница
         */
        view: function(page) {
            if (this.debug) {
                console.warn('Page view: ' + page);
            }

            if (ga === undefined) {
                return;
            }

            ga.push(['_trackPageview', page]);
        }

    };

    jQuery('#play').click(function(){
        window.track_js.event('sector', 'PLAY CLICK', 'пользователь жмакнул на play');
    });

}(this));
