window.programActive = {
  rows: document.getElementsByClassName('programs__row'),

  breakPoints: [],

  time: {},

  init: function () {
    this.setBreakpoints();
    this.getTimezone();
  },

  setBreakpoints: function () {
    for (var i = 0; i < this.rows.length; i++) {
      this.breakPoints.push(Number(this.rows[i].getAttribute('data-time')));
    }
  },

  getTimezone: function () {
    SECTOR.progress.apiPromise
      .then((function (data) {
        this.serverTime = data.timestamp;
        this.updateServerTime();
        clearInterval(this.interval);
        
        this.interval = setInterval((function() {
          this.serverTime += 1;
          this.updateServerTime();
        }).bind(this), 1000);

        this.setUpdateInterval(0);
      }).bind(this));
  },

  updateServerTime: function () {
    this.time.now = new Date(this.serverTime*1000);
    this.time.hours = this.time.now.getHours();
    this.time.minutes = this.time.now.getMinutes();
    this.time.seconds = this.time.now.getSeconds();
    this.time.moscowHours = ((this.time.hours + this.time.now.getTimezoneOffset()/60) + 3);
  },

  getBreakpoint: function () {
    if (this.time.moscowHours % 2) {
      this.nextBreakpointIn = (60 - this.time.seconds) * 1000 + (119 - this.time.minutes) * 60 * 1000;
    } else {
      this.nextBreakpointIn = (60 - this.time.seconds) * 1000 + (59 - this.time.minutes) * 60 * 1000;
    }
  },

  getActiveRow: function () {
    if (this.time.moscowHours % 2) {
      this.activeRow = this.breakPoints.indexOf(this.time.moscowHours);

    } else {
      this.activeRow = this.breakPoints.indexOf(this.time.moscowHours - 1);
    }
  },

  setUpdateInterval: function (time) {
    setTimeout((function () {
      if (time) {
        this
          .rows[this.activeRow]
          .classList
          .toggle('programs__row-active');
      }
      
      this.getActiveRow();
      this
        .rows[this.activeRow]
        .classList
        .toggle('programs__row-active');

      this.getBreakpoint();
      this.setUpdateInterval(this.nextBreakpointIn);
    }).bind(this), time);
  }
};

programActive.init();