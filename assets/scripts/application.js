'use strict';

const sector = require('./conf');

sector.modules.forEach((module)=> {
  connect(module);
});

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

require('./components/sector/Ctrl')(sector);
require('./components/sector/Directive')(sector);
require('./components/routing')(sector);
require('./components/localization/localization')(sector);


///////////////////////////////////////////////////////////////////////
//    ___  _____                  _           _            _  _  _   //
//   |_  ||  _  |                | |         | |          | || || |  //
//     | || | | |   __ _   ___   | |_  ___   | |__    ___ | || || |  //
//     | || | | |  / _` | / _ \  | __|/ _ \  | '_ \  / _ \| || || |  //
// /\__/ /\ \/' / | (.) || (.) | | |_| (.) | | | | ||  __/| || ||_|  //
// \____/  \_/\_\  \__, | \___/   \__|\___/  |_| |_| \___||_||_|(_)  //
//                  __/ |                                            //
//                  |___/                          powered by ASCII  //
///////////////////////////////////////////////////////////////////////

var SECTOR = {};
SECTOR.api = require('./components/api')();
var progress = require('./components/progressBar')(SECTOR);
var status = require('./components/updateStatus')(SECTOR);
var program = require('./components/updateProgram')(SECTOR);
var slider = require('./components/volumeSlider');
//
require('../styles/application');
//
// SECTOR.api.init();
// program.init();
// status.init();
// progress.init();
// slider();
