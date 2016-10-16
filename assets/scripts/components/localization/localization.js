module.exports = function (sector) {
  sector.config(function ($translateProvider) {
    $translateProvider
      .preferredLanguage('ru')
      .useStaticFilesLoader({
        prefix: "assets/scripts/components/localization/locale-",
        suffix: '.json'
      });
  });
};