module.exports = function (sector) {
  sector.config(function ($translateProvider) {
    $translateProvider
      .translations('en', {
        TEST: {
          "one" : "two"
        }
      })
      .preferredLanguage('en');
  })
    .controller('LocCtrl', function ($translate) {
      $translate.use('en');
    });
};