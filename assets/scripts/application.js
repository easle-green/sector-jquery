'use strict';

require('./vendor/jquery.js');
require('./vendor/jquery.jplayer.js');
require('./vendor/jquery.easing.1.3.js');
require('./vendor/jquery.backgroundSize.js');
require('./vendor/bgpos.js');
require('./vendor/EventEmitter-4.0.3.min.js');
require('./vendor/sidebarEffects.js');
require('simplebar');

window.SECTOR = window.SECTOR || {};
SECTOR.api = require('./components/api')(); // = import

var progress = require('./components/progressBar')(SECTOR);
var status = require('./components/updateStatus')(SECTOR);
var program = require('./components/updateProgram')(SECTOR);
var slider = require('./components/volumeSlider')(SECTOR);
var langSwitcher = require('./components/langSwitcher')();

require('./common.js');
require('./uploader.js');

require('../styles/application');
require('simplebar/dist/simplebar.css');

SECTOR.api.init();
program.init();
status.init();
progress.init();
slider.init();

require.ensure([
    "./languages/languages.js"
], function(require) {
    SECTOR.hidePreloader();
    langSwitcher.init(require("./languages/languages.js"));
}, 'languages');
