var SECTOR = SECTOR || {};

$(document).ready(function() {

  // buttons animation
  $('#play').css({
    backgroundSize: "cover"
  });


  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $('body').addClass('is_mobile');
  }

  // плеер
  var current = $('.player__bitrate-active > .player__bitrate-name'),
    current = {
      channel: current.data('channel'),
      source: current.attr('rel')
    };

  window.currentVolume = .75;

  initPlayer(current.channel, current.source);

  volumeSlider({
    container: $('#volume .equalizer__container-line'),
    point: $('#volume .equalizer__container-point'),
    tooltip: $('#volume .player__volume-size'),
    fill: $('#volume .equalizer__container-bg'),
    callback: function(volume) {
      window.currentVolume = volume / 100;
      changeVolume(volume);
    }
  });

  $('#play')
    .click(function() {
      if (!$(this).hasClass('pause')) {
        buttonPlay(true);
        $("#jplayer").jPlayer('play');
      } else {
        buttonPlay(false);
        $("#jplayer").jPlayer('stop');
      }
      updateStatus();
    });

  // Use module for this and retrieve track info from API url http://sectorradio.ru/api/track.php?channel=<current_channel>
  // Current channel you can find in #track-loader data-attributes
  updateStatus();
  setInterval(function() {
    updateStatus();
  }, 3000);

  // изменение битрейта
  $('#player-bitrate .player__bitrate-name').click(function() {
    if ($(this).parent().hasClass('.player__bitrate-active')) {
      return;
    }

    var bitrate = $('#player-bitrate'),
      active = bitrate.find('.player__bitrate-active'),
      value = parseInt($(this).prop('rel')),
      channel = $(this).data('channel'),
      current_value = parseInt(active.children('a').prop('rel')),
      //percent = parseInt($(this).data('color')),
      player = $("#jplayer"),
      play = $('#play'),
      played = play.hasClass('pause');

    animateBitrate($('#equalizer .' + current_value + 'k'), value, (
      current_value < value ? 'up' : 'down'));
    active.removeClass('player__bitrate-active');
    $(this).parent().addClass('player__bitrate-active');
    //changeColor(lighten($default_color, percent));

    if (played) {
      player.jPlayer("stop");
      play.removeClass('pause');
    }

    player.jPlayer("destroy");
    initPlayer(channel, value);

    if (played) {
      setTimeout(function() {
        play.addClass('pause');
        $("#jplayer").jPlayer('play');
      }, 250)
    }
  });

  // скроллинг
  /*
  $('#history-block')
      .height($(window).height())
      .mCustomScrollbar({
          mouseWheelPixels: 1000,
          scrollButtons:{
              enable: true
          },
          advanced:{
              updateOnBrowserResize: true,
              updateOnContentResize: true,
              normalizeMouseWheelDelta: true
          },
          contentTouchScroll: true
      });
  */

  $('#tabs .menu__list-item').click(function() {
    if ($(this).hasClass('active')) {
      return;
    }
    var index = $(this).index();
    $('#tabs .menu__list-item.active').removeClass('active');
    $(this).addClass('active');

    $('#tabs_content > .active')
      .removeClass('active')
      .slideUp();

    $($('#tabs_content > div')[index])
      .addClass('active')
      .slideDown();
  });


  $(window).bind('resize', function() {
    $('body').css('width', $(document).width());
  });

});

animateBitrate = function(curr, rate, dir) {
  var up = (dir === 'up'),
    left = (up ? 0 : '-20px'),
    next;

  if (dir === 'up') {
    next = curr.next();
  } else {
    next = curr.prev();
  }

  if (!up) {
    curr.addClass('disabled');
  }
  curr.find('div:first > b').stop().animate({
    left: left
  }, 100);
  curr.find('div:last').stop().animate({
    left: left
  }, 100, function() {
    if (up) {
      curr.removeClass('disabled');
    }
    if (!curr.hasClass(rate + 'k') && !(!up && curr.prev().hasClass(rate +
        'k'))) {
      animateBitrate(next, rate, dir);
    } // else {
    //   changeBitrate(up);
    //}
  });

};

/*changeBitrate = function(up) {
    $('#equalizer > li').each(function(){
        var current = parseInt($(this).attr('class').replace(/size(\d+) (.+)/, '$1').replace('size', '')),
            change = current + (up? 10 : -10);

        console.log(current)

        if (change <= 90 && change > 0) {
            $(this)
                .removeClass('size'+current)
                .addClass('size'+change)
        }

    });

}*/

initPlayer = function(channel, ices) {
  $("#jplayer").jPlayer({
    volume: window.currentVolume,
    ready: function() {
      $(this).jPlayer("setMedia", {
        oga: "http://89.223.45.5:8000/" + channel + "-" + ices
      });
      // ready callback
    },
    swfPath: "images",
    supplied: "oga"
  });
};

changeVolume = function(volume) {
  $("#jplayer").jPlayer("option", "volume", window.currentVolume);
};

/*
checkTime = function() {
    var now = new Date(),
        hours = now.getHours(),
        night = '#6A758D',
        evening = '#20A0A5';

    if(hours<7 || hours>22) {
        changeColor(night);
        return night;
    } else if (hours>=7 && hours <= 12) {
        changeColor(evening);
        return evening;
    }
};


changeColor = function(color) {
    $('body').css('background-color', color);
    return color;
}


lighten = function (color, light) {
    color = color.replace(/[^0-9,]+/g, "");
    var red = color.split(",")[0];
    var gre = color.split(",")[1];
    var blu = color.split(",")[2];

    var hsv = RgbToHsv(red,gre,blu);
    var rgb = HsvToRgb(hsv.h, hsv.s, light);

    return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
}
*/

updateStatus = function() {
    var track = document.getElementById('track-loader');
    // TODO Use XMLHttpRequest for this.
    // Do not copy-paste from progressbar.js for new module, make only one xhr function for both
    $.get(
        //'/nowplaying-' + $('#track-loader').data('channel') + '.txt?' + Date.now(),
        '/track.json?' + Date.now(),
        function(info) {
            track.querySelector('.player__title').innerText = info.artist;
            track.querySelector('.player__trackname').innerText = info.title;
        }
    )
};

buttonPlay = function($play) {
  $('#play').stop().animate({
    width: '70px',
    height: '70px',
    top: '5px',
    left: '5px'
  }, 50, function() {
    if ($play)
      $(this).addClass('pause');
    else
      $(this).removeClass('pause');
    $(this).stop().animate({
      width: '80px',
      height: '80px',
      top: 0,
      left: 0
    }, 70, 'easeOutCirc');
  });
};


/* ----------------------------------

function RgbToHsv(r, g, b) {
    var min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        delta = max - min,
        h, s, v = max;

    v = Math.floor(max / 255 * 100);
    if (max == 0) return [0, 0, 0];
    s = Math.floor(delta / max * 100);
    var deltadiv = delta == 0 ? 1 : delta;
    if( r == max ) h = (g - b) / deltadiv;
    else if(g == max) h = 2 + (b - r) / deltadiv;
    else h = 4 + (r - g) / deltadiv;
    h = Math.floor(h * 60);
    if( h < 0 ) h += 360;
    return { h: h, s:s, v:v }
}

function HsvToRgb(h, s, v) {
    h = h / 360;
    s = s / 100;
    v = v / 100;

    if (s == 0)
    {
        var val = Math.round(v * 255);
        return {r:val,g:val,b:val};
    }
    hPos = h * 6;
    hPosBase = Math.floor(hPos);
    base1 = v * (1 - s);
    base2 = v * (1 - s * (hPos - hPosBase));
    base3 = v * (1 - s * (1 - (hPos - hPosBase)));
    if (hPosBase == 0) {red = v; green = base3; blue = base1}
    else if (hPosBase == 1) {red = base2; green = v; blue = base1}
    else if (hPosBase == 2) {red = base1; green = v; blue = base3}
    else if (hPosBase == 3) {red = base1; green = base2; blue = v}
    else if (hPosBase == 4) {red = base3; green = base1; blue = v}
    else {red = v; green = base1; blue = base2};

    red = Math.round(red * 255);
    green = Math.round(green * 255);
    blue = Math.round(blue * 255);
    return {r:red,g:green,b:blue};
}
*/
