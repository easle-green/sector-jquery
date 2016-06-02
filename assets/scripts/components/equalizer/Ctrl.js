module.exports = function (sector) {
  sector.controller('EqualizerCtrl', function ($rootScope, $scope, Bitrate, Equalizer, DEFAULTS) {
    $scope.equalizer = DEFAULTS.equalizer;
    $scope.bitrate = DEFAULTS.bitrate;

    $scope.$watch(() => Bitrate.bitrate, (newRate, oldRate) => {
      if (newRate !== oldRate) {
        $scope.update(newRate, oldRate);
      }
    });


    $scope.update = function (newRate, oldRate) {
      let freqs = document.querySelectorAll('#equalizer .equalizer__container-element');
      let lastActive;
      let up = (oldRate > newRate) ? 0 : 1;

      // set last active eq element
      for(let i = 0; i < freqs.length; i++) {
        if(freqs[i].classList.contains('disabled')) {
          lastActive = i;
          break;
        }
      }

      // update eq elements classes
      function updateClass(i) {
        if(parseInt(freqs[i].getAttribute('data-rate')) > newRate) {
          freqs[i].classList.add('disabled');
          lastActive = i;

        } else {
          freqs[i].classList.remove('disabled');
        }
      }

      // set animation depends on direction
      if (up) {
        let i = lastActive;
        let interval = setInterval(function () {
          updateClass(i);
          i++;
          if (i === freqs.length) {
            clearInterval(interval);
          }
        }, 50);
      } else {
        let i = lastActive;
        let interval = setInterval(function () {
          updateClass(i);
          i--;
          if (i === 0) {
            clearInterval(interval);
          }
        }, 50);
      }
    };
  })
};