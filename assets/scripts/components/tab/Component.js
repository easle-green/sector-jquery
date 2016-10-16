module.exports = function (sector, template) {
  sector.component('tabBlock', {
    bindings: {},
    template: template,
    controller: 'TabCtrl',
    replace: true
  });
};