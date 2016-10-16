
module.exports = function(sector) {
  sector.controller('TabCtrl', function($rootScope, $scope, DEFAULTS, Tab) {

    $scope.tab_names = [
      'Качество  —  наше всё',
      'Эфирная сетка'
    ];
    //debugger;
    $scope.active = Tab.active;

    $scope.isActive = function(id) {
      return Tab.get() === id;
    };

    $scope.update = function(id) {
      $scope.active = Tab.set(id);
    };
    
    

  });
};