var changeColor = {

    color_6_9: '#24a564',
    color_9_12: '#20a0a5',
    color_12_15: '#d08039',
    color_15_18: '#ec6548',
    color_18_21: '#52687d',
    color_21_23: '#858341',
    color_23_6: '#67665f',

    init: function () {
        this.checkTime();
        setInterval(function(){ changeColor.checkTime()}, 30000);
    },

    checkTime: function () {
        var now = new Date(),
            hours = now.getHours();

        if(hours>=6 && hours<=9) {
            this.newColor(this.color_6_9);
        } else if (hours>9 && hours <=11) {
            this.newColor(this.color_9_12);
        } else if (hours>=12 && hours <=14) {
            this.newColor(this.color_12_15);
        } else if (hours>=15 && hours <=17) {
            this.newColor(this.color_15_18);
        } else if (hours>=18 && hours <=20) {
            this.newColor(this.color_18_21);
        } else if (hours>=21 && hours <=22) {
            this.newColor(this.color_21_23);
        } else if (hours>=23 || hours <=6) {
            this.newColor(this.color_23_6);
        } else {
            this.newColor(this.color_6_9);
        }
    },

    newColor: function(color) {
        $('body')
            .css('background-color', color);
    }
};

changeColor.init()
