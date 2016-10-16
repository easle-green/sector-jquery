module.exports = function (sector) {
  sector.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider
      .otherwise('/');

    $stateProvider
      .state('main', {
        url: '/'
      })
      .state('space', {
        url: '/space'
      })
      .state('90', {
        url: '/90'
      });
  });
};