'use strict';
const localizedProperty = {
    'ru-RU': require('../languages/ru-RU.json'),
    'en-US': require('../languages/en-US.json')
};


function switcher(SECTOR) {
    'use strict';

    return {

        byId: 'lang-switcher',
        currentLanguage: 'ru-RU',
        defaultLanguage: 'ru-RU',
        browserLanguage: '',

        init: function () {
            this.languageDeterminater();
            this.languageProcessor();
            this.onClick = this.onClick.bind(this);
            this.languageSwitcher();
        },

        languageDeterminater: function () {
            debugger;
            this.browserLanguage = window.navigator.language;
            if (this.browserLanguage !== null) {
                this.currentLanguage = this.browserLanguage;
                const elem = document.querySelector(`[data-id='${this.browserLanguage}']`);
                elem.className += ' active';
            }
        },

        languageProcessor() {

            let foundProperty = localizedProperty[this.currentLanguage];

            if (foundProperty === null) {
                this.currentLanguage = this.defaultLanguage;
                foundProperty = localizedProperty[this.currentLanguage];
            }

            for (let translation in foundProperty) {
                const elem = document.querySelector(`[data-lang='${translation}']`);
                if (elem !== null) {
                    elem.innerHTML = foundProperty[translation];
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

                let lis = document.querySelectorAll('#lang-switcher li a');

                for (let i = 0; i < lis.length; i++) {
                    lis[i].className = 'lang__icon';
                }
                event.target.className += ' active';
                this.languageProcessor()
            }
        },
    }
}

module.exports = switcher;