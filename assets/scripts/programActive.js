window.programActive = {
  rows: document.getElementsByClassName('programs__row'),

  breakPoints: [],

  time: {},

  init: function () {
    this.setBreakpoints();
    this.getServerTime(0);
  },

  getServerTime: function (time) {
    SECTOR.progress.apiPromise
      .then((function (data) {
        this.time.now = new Date(data.timestamp*1000);
        this.setUpdateInterval(time);
      }).bind(this));
  },

  setBreakpoints: function () {
    for (var i = 0; i < this.rows.length; i++) {
      this.breakPoints.push(Number(this.rows[i].getAttribute('data-time')));
    }
  },

  getBreakpoint: function () {
    if (this.time.hours % 2) {
      this.nextBreakpointIn = (60 - this.time.seconds) * 1000 + (119 - this.time.minutes) * 60 * 1000;
    } else {
      this.nextBreakpointIn = (60 - this.time.seconds) * 1000 + (59 - this.time.minutes) * 60 * 1000;
    }
  },

  getTime: function () {
    // this.getServerTime();
    // console.log(programActive.time);

    this.time.hours = this.time.now.getHours();
    this.time.minutes = this.time.now.getMinutes();
    this.time.seconds = this.time.now.getSeconds();
  },

  getActiveRow: function () {
    if (this.time.hours % 2) {
      this.activeRow = this.breakPoints.indexOf(this.time.hours);

    } else {
      this.activeRow = this.breakPoints.indexOf(this.time.hours - 1);
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

      this.getTime();
      this.getActiveRow();

      this
        .rows[this.activeRow]
        .classList
        .toggle('programs__row-active');

      this.getBreakpoint();
      this.getServerTime(this.nextBreakpointIn);
    }).bind(this), time);
  }
};

programActive.init();