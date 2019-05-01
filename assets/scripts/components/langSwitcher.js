'use strict';

function switcher() {

    return {

        byId: 'lang-switcher',
        currentLanguage: 'ru-RU',
        defaultLanguage: 'ru-RU',
        listWithLiTags: document.querySelectorAll('#lang-switcher a'),
        localizedProperty: {},

        init: function (localizedProperty) {
            this.onClick = this.onClick.bind(this);
            this.langMatcher = this.langMatcher.bind(this);
            this.localizedProperty = localizedProperty;

            this.browserLanguageIdentifier();
            this.setActiveLanguage();
            this.languageProcessor();
            this.languageSwitcher();
        },

        browserLanguageIdentifier: function () {
            this.currentLanguage =
                localStorage.getItem('language') || navigator.language ||
                navigator.userLanguage || navigator.systemLanguage || this.defaultLanguage;

            // language can be "ru" or "en", not "ru-RU"!
            if ( typeof this.localizedProperty[this.currentLanguage] !== 'undefined' ) {
                return;
            }

            this.currentLanguage = this.defaultLanguage;
            var firstMatch = Object.keys(this.localizedProperty).reduce(this.langMatcher, false);
            if( firstMatch.length ) {
                this.currentLanguage = firstMatch[0];
            }
        },

        setActiveLanguage: function() {
            var selector = document.querySelector('[data-id="' + this.currentLanguage + '"]');

            if ( selector !== null ) {
                selector.className += ' active';
            }
        },

        langMatcher: function(prev, next) {
            return prev || next.match(this.currentLanguage);
        },

        languageProcessor: function() {
            if (this.localizedProperty[this.currentLanguage] === null) {
                this.currentLanguage = this.defaultLanguage;
            }

            var foundProperty = this.localizedProperty[this.currentLanguage];

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

                // save current selection
                localStorage.setItem('language', this.currentLanguage);

                this.languageProcessor();
            }
        }
    }
}

module.exports = switcher;
