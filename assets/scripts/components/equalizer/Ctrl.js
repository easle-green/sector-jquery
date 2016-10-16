module.exports = function (sector) {
  sector.controller('EqualizerCtrl', function ($rootScope, $scope, $interval, Bitrate, Equalizer, DEFAULTS) {
    $scope.equalizer = DEFAULTS.equalizer;
    $scope.bitrate = DEFAULTS.bitrate;
    var interval;
    $scope.map = $scope.equalizer.map((freq) => {
      "use strict";
      if (freq.active <= $scope.bitrate) {
        return 1;
      } else {
        return 0;
      }
    });

    $scope.$watch(() => Bitrate.bitrate, (newRate, oldRate) => {
      if (newRate !== oldRate) {
        $scope.update(newRate, oldRate);
      }
    });


    $scope.update = function (newRate, oldRate) {
      let lastActive;
      let up = (oldRate > newRate) ? 0 : 1;

      // set last active eq element
      for(let i = 0; i < $scope.map.length; i++) {
        if(!$scope.map[i]) {
          lastActive = i-1;
          break;
        }
      }

      // break previous animation
      if (interval !== undefined) {
        $interval.cancel(interval);
      }
      // set animation depends on direction
      if (up) {

        let i = lastActive;
        interval = $interval(function () {
          if($scope.equalizer[i].active <= $scope.bitrate) {
            $scope.map[i] = 1;
          } else {
            $interval.cancel(interval);
          }
          i++
        }, 80);
      } else {
        let i = lastActive;
        interval = $interval(function () {
          if($scope.equalizer[i].active >= $scope.bitrate) {
            $scope.map[i] = 0;
          } else {
            $interval.cancel(interval);
          }
          i--;
        }, 80);
      }
    };
  })
};