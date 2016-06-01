module.exports = function (sector) {
  sector.controller('EqualizerCtrl', function ($rootScope, $scope, Bitrate, Equalizer, DEFAULTS) {
    $scope.equalizer = DEFAULTS.equalizer;
    $scope.bitrate = DEFAULTS.bitrate;
    

    $scope.update = function (rate) {
      // let freqs = Equalizer.freqs;

      let freqs = document.querySelectorAll('#equalizer .equalizer__container-element');
      console.log(freqs[0]);
      console.log('it works!');
      let earlyBitrate = this.bitrate;
      let lastActive;
      let up = (earlyBitrate > rate) ? 0 : 1;
      this.bitrate = rate;

      // set last active eq element
      for(let i = 0; i < freqs.length; i++) {
        if(freqs[i].classList.contains('disabled')) {
          lastActive = i;
          break;
        }
      }

      // update eq elements classes
      function updateClass(i) {
        if(parseInt(freqs[i].getAttribute('data-rate')) > rate) {
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
    $scope.$watch(() => $scope.bitrate, () => console.log('Изменилась'));

    $scope.$watch(() => $scope.bitrate, (old, neww) => {
      debugger;
      if (old !== neww || old !== undefined) $scope.update($scope.bitrate);
    });
  })
};