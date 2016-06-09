module.exports = function (sector) {
  sector.controller('LanguagesCtrl', function ($scope, $translate, DEFAULTS) {
    $scope.languages = DEFAULTS.languages;
    $scope.language = 'ru';
    $scope.changeLanguage = function (language) {
      $translate.use(language);
      $scope.language = language;
    }
  });
};