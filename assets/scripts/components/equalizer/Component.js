module.exports = function (sector, template) {
  sector.component('equalizerBlock', {
    bindings: {},
    template: template,
    controller: 'EqualizerCtrl',
    replace: true
  });
};