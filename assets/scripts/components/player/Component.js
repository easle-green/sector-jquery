module.exports = function (sector, template) {
  sector.component('player', {
    bindings: {},
    template: template,
    controller: 'PlayerCtrl',
    replace: true
  });
};