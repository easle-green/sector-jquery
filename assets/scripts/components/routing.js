module.exports = function (sector) {
  sector.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider
      .otherwise('/main');
    $stateProvider
      .state('main', {
        url: '/main'
      })
      .state('space', {
        url: '/space'
      });
  });
};