module.exports = function(sector) {
	sector.factory('Bitrate', function (DEFAULTS) {
		return {

			bitrate: DEFAULTS.bitrate,

			get: function () {
				return this.bitrate;
			},

			update: function (rate) {
				rate = Number(rate);
				if (isNaN(rate) || DEFAULTS.rates.indexOf(rate) === -1) {
					rate = this.bitrate;
				}
				this.bitrate = rate;
				console.log(rate);
				return rate;
			}
		}
	});
};