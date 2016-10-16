module.exports = function (sector, template) {
  sector.component('blocksBlock', {
    bindings: {},
    template: template,
    controller: 'BlocksCtrl',
    replace: true
  });
};