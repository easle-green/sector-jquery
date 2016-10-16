module.exports = function(sector, template) {
	sector.component('bitrateBlock', {
		bindings: {},
		template: template,
		controller: 'BitrateCtrl',
		replace: true
	});
};