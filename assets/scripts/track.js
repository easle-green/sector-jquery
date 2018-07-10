(function(global) {

  "use strict";

  var console = global.console,
      ga = global._gaq,

  track_js = {

    submit_status: false,
    debug: true,

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
    event: function(page, ev, description) {
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

  function playClicked() {
    track_js.event('sector', 'PLAY CLICK',
        'пользователь жмакнул на play');
  }

  document.getElementById('play').addEventListener('click', playClicked.bind(this));

}(window));
