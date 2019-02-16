'use strict';
const localizedProperty = {
    'ru-RU': require('../languages/ru-RU.json'),
    'en-US': require('../languages/en-US.json')
};


function switcher() {

    return {

        byId: 'lang-switcher',
        currentLanguage: 'ru-RU',
        defaultLanguage: 'ru-RU',
        browserLanguage: 'ru-RU',
        listWithLiTags: document.querySelectorAll('#lang-switcher a'),

        init: function () {
            this.onClick = this.onClick.bind(this);

            this.browserLanguageIdentifier();
            this.languageProcessor();
            this.languageSwitcher();
        },

        browserLanguageChecker() {
            return this.browserLanguage === null || this.browserLanguage === undefined;
        },

        browserLanguageIdentifier: function () {
            this.browserLanguage = window.navigator.language; // if chrome firefox ...

            if (browserLanguageChecker()) {
                this.browserLanguage = navigator.userLanguage; //  if explorer
            }

            if (browserLanguageChecker()) {
                this.browserLanguage = this.defaultLanguage; // if all functions is not supported
            }

            this.currentLanguage = this.browserLanguage;
            document
                .querySelector('[data-id="' + this.browserLanguage + '"]')
                .className += ' active';
        },

        languageProcessor: function() {
            if (localizedProperty[this.currentLanguage] === null) {
                this.currentLanguage = this.defaultLanguage;
            }

            var foundProperty = localizedProperty[this.currentLanguage];

            for (var translation in foundProperty) {
                var query = document.querySelectorAll('[data-lang="' + translation +'"]');

                if (translation.indexOf("img") !== -1) {
                    for (var i = 0; i < query.length; i++) {
                        query[i].src = foundProperty[translation];
                    }
                }

                if (translation.indexOf("reused") !== -1){
                    for (var j = 0; j < query.length; j++){
                        query[j].innerHTML = foundProperty[translation];
                    }

                }

                var domElement = document.querySelector('[data-lang="' + translation +'"]');
                if (domElement !== null) {
                    domElement.innerHTML = foundProperty[translation];
                }
            }

        },

        languageSwitcher: function() {
            document.getElementById(this.byId).addEventListener("click", this.onClick);
        },

        onClick: function(event) {
            if (event.target.classList.contains('active')) {
                return;
            }

            if (event.target.tagName.toLocaleLowerCase() === 'a') {
                this.currentLanguage = event.target.getAttribute('data-id');

                var activeSelector = document.querySelector('#lang-switcher .active');

                activeSelector.className = activeSelector.className.replace(' active', '');
                event.target.className += ' active';

                this.languageProcessor();
            }
        },
    }
}

module.exports = switcher;
