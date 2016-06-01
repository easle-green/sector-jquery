module.exports = function(sector) {
	sector.controller('BitrateCtrl', function($rootScope, $scope, DEFAULTS, Bitrate, Equalizer) {

		$scope.bitrate = Bitrate.get();
		$scope.rates = DEFAULTS.rates;

		$scope.update = function(rate) {
			$scope.bitrate = Bitrate.update(rate);
			// Equalizer.update(rate);
		};

	});
};