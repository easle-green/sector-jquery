module.exports = function (sector) {
  sector.controller('MainCtrl', function ($scope, $state) {
    $scope.is = function(name) {
      return $state.is(name)
    };
  });
};