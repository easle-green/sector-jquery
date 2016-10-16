module.exports = function(sector) {
	sector.controller('BitrateCtrl', function($rootScope, $scope, DEFAULTS, Bitrate) {

		$scope.bitrate = Bitrate.get();
		$scope.rates = DEFAULTS.rates;

		$scope.update = function(rate) {
			$scope.bitrate = Bitrate.update(rate);
		};

	});
};