module.exports = function (sector, template) {
  sector.component('languagesBlock', {
    bindings: {},
    template: template,
    controller: 'LanguagesCtrl',
    replace: true
  });
};