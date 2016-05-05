;
(function() {
  'use strict';
  var breakPoints = ['day', 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 1, 3];
  var rows = document.getElementsByClassName('programs__row');
  var now;
  var hours;
  var minutes;
  var seconds;
  var timezone;
  var moscowHours;
  var nextBreakpointIn;
  var activeRowNumber;

  function getTime() {
    now = new Date();
    hours = now.getHours();
    minutes = now.getMinutes();
    seconds = now.getSeconds();
    timezone = now.getTimezoneOffset();
    moscowHours = hours + (timezone + 180) / 60;
  }
  getTime();



  function getActiveRow() {
    if (hours % 2) {
      activeRowNumber = breakPoints.indexOf(hours);
    } else {
      activeRowNumber = breakPoints.indexOf(hours - 1);
    }
  }
  getActiveRow();

  function toggleRow() {
    rows[activeRowNumber].classList.toggle('programs__row-active');
  }
  toggleRow();

  function getBreakpoint() {
    if (hours % 2) {
      nextBreakpointIn = (60 - seconds) * 1000 + (119 - minutes) * 60 * 1000;
    } else {
      nextBreakpointIn = (60 - seconds) * 1000 + (59 - minutes) * 60 * 1000;
    }
  }
  getBreakpoint();


  function setUpdateInterval(time) {
    setTimeout(function() {
      toggleRow();

      getTime();

      getActiveRow();

      toggleRow();

      getBreakpoint();

      setUpdateInterval(nextBreakpointIn);

    }, time);
  }
  setUpdateInterval(nextBreakpointIn);

})();
