'use strict';
const localizedProperty = {
    ruRu: require('../languages/ruRU.json'),
    enUs: require('../languages/enUS.json')
};


function switcher(SECTOR) {
    'use strict';

    return {

        byId: 'lang-switcher',
        currentLanguage: 'ruRu',
        defaultLanguage: 'ruRu',

        init: function () {
            this.onClick = this.onClick.bind(this);
            this.languageSwitcher();
            this.languageProcessor();
        },

        languageProcessor() {
            debugger;
            let foundProperty = localizedProperty[this.currentLanguage];

            if (foundProperty === null) {
                this.currentLanguage = this.defaultLanguage;
            }

            for (let translation in foundProperty) {
                const elem = document.querySelector(`[data-lang='${translation}']`); // found dom element by key of json
                if (elem !== null) {
                    elem.innerHTML = foundProperty[translation]; // Change the HTML content of a <h2 class="logo__slogan-about" data-lang="head"></h2>
                }
            }
        },

        languageSwitcher() {
            document.getElementById(this.byId).addEventListener("click", this.onClick); // when other language is clicked
        },

        onClick(event) {
            debugger;
            if (event.target.classList.contains('active')) { // if chousen language the same as current
                return;
            }
            if (event.target.tagName.toLocaleLowerCase() === 'a') {
                this.currentLanguage = event.target.getAttribute('data-id'); // enUs
                this.languageProcessor()
            }
        },
    }
}

module.exports = switcher;