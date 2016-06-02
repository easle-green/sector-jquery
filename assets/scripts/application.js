'use strict';
// Use npm packages for vendors
//require.context('./vendor', true, /\.js$/)([]);

// Use commonJS format for modules
//require('./common');
//require.context('./components', true, /\.js$/)([]);

const sector = require('./conf');

sector.modules.forEach((module)=> {
  connect(module);
});

function connect(module) {
  let path = './components/' + module + '/';
  require(path + 'Model')(sector);	// Model
  require(path + 'Ctrl')(sector); 	// Controller
  // require(path + 'styles');			// Styles
  require(path + 'Component')(		// Component
    sector,
    require(path + 'template.html')	// Template
  );
}
//
// var SECTOR = {};
// SECTOR.api = require('./components/api')();
// var progress = require('./components/progressBar')(SECTOR);
// var status = require('./components/updateStatus')(SECTOR);
// var program = require('./components/updateProgram')(SECTOR);
// var slider = require('./components/volumeSlider');
//
//
require('../styles/application');
//
// SECTOR.api.init();
// program.init();
// status.init();
// progress.init();
// slider();
