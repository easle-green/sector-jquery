(function (SECTOR) {
    'use strict';

    var program = {

        byId: 'program',
        byDays: 'programs-days',

        byRows: '.programs__row:not(:first-child)',
        byHour: '.programs-head',
        byActive: 'programs__row-active',

        init: function () {
            this.block = document.getElementById(this.byId);
            this.days = document.getElementById(this.byDays);
            this.hourItems = this.block.querySelectorAll(this.byRows);

            this.addClasses();

            SECTOR.api.requestEmitter.addListener('requestReady', this.setColumn.bind(this));

            return this;
        },

        addClasses: function() {
            var dayChildren = this.days.querySelectorAll('div:not(:first-child)');
            Array.prototype.forEach.call(dayChildren, function(item, i) {
                item.className += " day-" + (i+1);
            });

            var hour = this.byHour;
            Array.prototype.forEach.call(this.hourItems, function(item, i) {
                item.className += " hour-" + parseInt(item.querySelector(hour).innerText.split(':')[0]);
            });
        },

        setColumn: function() {
            var active = this.block.querySelector('.' + this.byActive);
            if ( active !== null ) {
                active.className = active.className.replace(this.byActive, '');
            }
            this
                .locateSibling( parseInt(SECTOR.api.trackInfo.timeset.hours) )
                .className += ' ' + this.byActive;
        },

        locateSibling: function(hour, current) {
            if ( !current ) {
                current = this.block.querySelector('.hour-'+hour);
            }

            if ( current === null ) {
                if ( hour === 0 ) {
                    hour = 24;
                }
                return this.locateSibling(--hour, current);
            }

            return current;
        }

    };

    SECTOR.program = program.init();

})(window.SECTOR);
