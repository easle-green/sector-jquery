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

        browserLanguageIdentifier: function () {
            this.browserLanguage = window.navigator.language;

            if (this.browserLanguage === null || this.browserLanguage === undefined) {
                this.browserLanguage = navigator.userLanguage;
            }

            if (this.browserLanguage === null || this.browserLanguage === undefined) {
                this.browserLanguage = this.defaultLanguage;
            }

            this.currentLanguage = this.browserLanguage;
            document
                .querySelector(`[data-id='${this.browserLanguage}']`)
                .className += ' active';

        },

        languageProcessor() {
            if (localizedProperty[this.currentLanguage] === null) {
                this.currentLanguage = this.defaultLanguage;
            }

            const foundProperty = localizedProperty[this.currentLanguage];

            for (let translation in foundProperty) {
                if (translation.indexOf("img") !== -1) {
                    let images = document.querySelectorAll(`[data-lang='${translation}']`);
                    for (let i = 0; i < images.length; i++) {
                        images[i].src = foundProperty[translation];
                    }
                }

                if (translation.indexOf("reused") !== -1){
                    let elements = document.querySelectorAll(`[data-lang='${translation}']`);
                    for (let j = 0; j < elements.length; j++){
                        elements[j].innerHTML = foundProperty[translation];
                    }

                }

                const domElement = document.querySelector(`[data-lang='${translation}']`);
                if (domElement !== null) {
                    domElement.innerHTML = foundProperty[translation];
                }
            }

        },

        languageSwitcher() {
            document.getElementById(this.byId).addEventListener("click", this.onClick);
        },

        onClick(event) {
            if (event.target.classList.contains('active')) {
                return;
            }

            if (event.target.tagName.toLocaleLowerCase() === 'a') {
                this.currentLanguage = event.target.getAttribute('data-id');

                const activeSelector = document.querySelector('#lang-switcher .active');

                activeSelector.className = activeSelector.className.replace(' active', '');
                event.target.className += ' active';

                this.languageProcessor();
            }
        },
    }
}

module.exports = switcher;
