window.SECTOR = window.SECTOR || {};

$(document).ready(function() {

    // buttons animation
    $('#play').css({
        backgroundSize: "cover"
    });

    // var pathName = location.pathname.replace(/\//g,'');
    // var pathName = location.pathname.replace('/','');
    var currentChannel = document.querySelector('#channel a[href="' + (location.pathname || '/') + '"]');
    if ( currentChannel ) {
        currentChannel.className += ' active';
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('body').addClass('is_mobile');
    }

    var bitrateContainer = document.getElementById('player-bitrate');

    SECTOR.currentVolume = localStorage.getItem('volume') || .75;
    SECTOR.updatePositionByVolume(SECTOR.currentVolume);

    if (!checkForOGG()) {
        var active = document.querySelector('.player__bitrate-active');
        bitrateContainer.className += ' disabled';
        animateBitrate($('#equalizer .' + parseInt(active.querySelector('.player__bitrate-name').rel) + 'k'), 'mp3', 'down');
        active.classList.remove("player__bitrate-active");
    }

	var flac = document.getElementById('flac');
    if (checkForFlac() && flac) {
        flac.style.display = 'block';
    }

    var init = false,
        play = $('#play'),
        player = $("#jplayer");

    play.click(clickAction.bind(this));

    function clickAction () {
        if ( historyOpened() ) {
            return;
        }
        if (!play.hasClass('pause')) {
            buttonPlay(true);
            if ( !init ) {
                var current = document.querySelector('.player__bitrate-active > .player__bitrate-name');
                if ( !current ) {
                    current = document.querySelector('.player__bitrate-element > .player__bitrate-name');
                }
                initPlayer(current.dataset.channel, current.rel);
                init = true;
            } else {
                player.jPlayer('play');
            }
        } else {
            buttonPlay(false);
            player.jPlayer('pause');
        }
        return init;
    }

    function historyOpened() {
        return /st-menu-open/.test(document.getElementById('st-container').className);
    }
    SECTOR.historyOpened = historyOpened;

  // изменение битрейта
  $('#player-bitrate .player__bitrate-name').click(function() {
      if ( historyOpened() ) {
          return;
      }
    if ($(this).parent().hasClass('.player__bitrate-active') || /disabled/.test(bitrateContainer.className)) {
      return;
    }

    var bitrate = $('#player-bitrate'),
      active = bitrate.find('.player__bitrate-active'),
      rel = $(this).prop('rel'),
      value = parseInt($(this).prop('rel')) || 256,
      channel = $(this).data('channel'),
      current_value = parseInt(active.children('a').prop('rel')) || 256,
      //percent = parseInt($(this).data('color')),
      player = $("#jplayer"),
      play = $('#play'),
      played = play.hasClass('pause');

    animateBitrate($('#equalizer .' + current_value + 'k'), value, (
      current_value < value ? 'up' : 'down')
    );
    active.removeClass('player__bitrate-active');
    $(this).parent().addClass('player__bitrate-active');
    //changeColor(lighten($default_color, percent));

    if (played) {
      player.jPlayer("stop");
      play.removeClass('pause');
    }

    player.jPlayer("destroy");
    initPlayer(channel, rel);

    if (played) {
      setTimeout(function() {
        play.addClass('pause');
        $("#jplayer").jPlayer('play');
      }, 250)
    }
  });

  $('#tabs .menu__list-item').click(function() {
      if ( historyOpened() ) {
          return;
      }
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

  // $(window).bind('resize', function() {
  //   $('body').css('width', $(document).width());
  // });

    var stContainer = document.getElementById('st-content'),
        bgDelta = 5;

    stContainer.onscroll = function(event) {
        if ( this.scrollTop > 500 ) {
            return;
        }
        this.style.backgroundPosition = '50% ' + (-this.scrollTop/bgDelta) + 'px';
    };

    $('#musicForm .input__field')
        .focus(function() {
            var label = $(this).next().find('.input__label-content');
            label.find('.input__label-text').text( label.data('hover') );
        })
        .blur(function() {
            var label = $(this).next().find('.input__label-content');
            label.find('.input__label-text').html(
                this.value !== '' && label.data('quick')
                  ? label.data('hover')
                  : label.data('text')
            );
            label.find('.input__value').html( this.value );
        })
        .change(function() {
            if ( SECTOR.form_validator() && SECTOR.file_uploaded ) {
                $('#music__send').removeClass('disabled');
            } else {
                $('#music__send').addClass('disabled');
            }
        });

    SECTOR.form_validator = function () {
        var form = '#musicForm',
            fields = ['FIO', 'NICKNAME', 'COUNTRY', 'EMAIL', 'STYLES'];

        return fields.reduce( function(num, field) {
            return $(form).find('[name="' + field + '"]').val() === '' ? ++num : num
        }, 0) === 0;
    };

    hidePreloader();

});

function animateBitrate(curr, rate, dir) {
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
    }
  });
}

function checkForOGG () {
    var audio = document.createElement('audio');
    return audio.canPlayType('audio/ogg;codecs="vorbis,opus"');
}

function checkForFlac() {
    var audio = document.createElement('audio');
    return audio.canPlayType('audio/flac');
}

function initPlayer(channel, ices) {
    var isOggSupported = checkForOGG(),
        stream = isOggSupported?
                    { oga: "http://89.223.45.5:8000/" + channel + "-" + ices }
                    :
                    { mp3: "http://89.223.45.5:8000/" + channel };

    $("#jplayer").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", stream);
            $(this).jPlayer("play");
            $('#play').addClass('pause');
        },
        swfPath: "assets",
        supplied: Object.getOwnPropertyNames(stream)[0]
    });
    SECTOR.changeVolume(SECTOR.currentVolume);
}

function hidePreloader() {
    if ( !/preloader-ready/.test(document.body.className) ) {
        setTimeout(function(){
            document.body.className += ' preloader-ready';
        }, 3500);
    }
}

SECTOR.changeVolume = function(volume) {
  $("#jplayer").jPlayer("option", "volume", volume);
};

function buttonPlay($play) {
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
}


/* ----------------------------------

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
