module.exports = function (sector) {
  sector.directive('sectorApp', function () {
    return {
      restrict: 'A',
      controller: 'MainCtrl'
    }
  })
};