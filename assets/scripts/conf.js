'use strict';

const angular = require('angular');
require('angular-ui-router');

const sector = angular.module('sector', ['ui.router']);

sector.modules = [
  'bitrate',
  'blocks',
  'equalizer',
  // 'player',
  'sidebar',
  'tab'
];

sector.value('DEFAULTS', {
  bitrate: 160,
  tab: 0,
  rates: [
    56,
    160
  ],
  equalizer: [
    {freq: "0.2", level: 100, active: 0},
    {freq: "1", level: 90, active: 0},
    {freq: "3", level: 70, active: 0},
    {freq: "5", level: 60, active: 0},
    {freq: "8", level: 70, active: 0},
    {freq: "6", level: 70, active: 0},
    {freq: "9", level: 60, active: 0},
    {freq: "10", level: 80, active: 56},
    {freq: "11", level: 60, active: 56},
    {freq: "12", level: 50, active: 56},
    {freq: "13", level: 60, active: 56},
    {freq: "15", level: 70, active: 160},
    {freq: "16", level: 60, active: 160},
    {freq: "17", level: 80, active: 160},
    {freq: "18", level: 80, active: 160},
    {freq: "20", level: 100, active: 256}
  ]
});

module.exports = sector;

