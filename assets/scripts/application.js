'use strict';

require('../styles/application');

// var $ = require("jquery");
var $ = require('expose?$!expose?jQuery!./vendor/jquery/dist/jquery');
require('../../node_modules/jplayer/dist/jplayer/jquery.jplayer');
require('./vendor/jquery.easing.1.3.js');
require('./vendor/jquery.backgroundSize.js');
require('./vendor/bgpos.js');

require('./vendor/EventEmitter-4.0.3.min.js');
require('./vendor/sidebarEffects.js');

var SECTOR = window.SECTOR || {};
require('./common.js');

SECTOR.api = require('./components/api')();
SECTOR.api.init();

require('./components/updateProgram')(SECTOR).init();
require('./components/progressBar')(SECTOR).init();
require('./components/updateStatus')(SECTOR).init();
require('./components/volumeSlider')();

const sector = require('./conf');

sector.modules.forEach((module)=> {
    connect(module);
});

require('./components/sector/Ctrl')(sector);
require('./components/sector/Directive')(sector);
require('./components/routing')(sector);
require('./components/localization/localization')(sector);

function connect(module) {
    let path = './components/' + module + '/';
    require(path + 'Model')(sector);
    require(path + 'Ctrl')(sector);
    // require(path + 'styles');			// Styles
    require(path + 'Component')(
        sector,
        require(path + 'template.html')
    );
}