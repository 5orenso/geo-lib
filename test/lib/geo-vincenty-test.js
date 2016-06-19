/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

let buster = require('buster'),
    assert = buster.assert,
    path = require('path'),
    appPath = path.normalize(__dirname + '/../../');

buster.testCase('lib/geo-vincenty', {
    setUp: () => {
    },
    tearDown: () => {
        delete require.cache[require.resolve(appPath + 'lib/geo-vincenty')];
    },
    'module functions:': {
        'distance between p1 and p2 in meters': () => {
            let geo = require(appPath + 'lib/geo-vincenty');
            let result = geo.distance(
                { lat: 70.3369224, lon: 30.3411273 },
                { lat: 59.8939528, lon: 10.6450348 }
            );
            assert.equals(result, 1472858.99);
        },

        'initialBearing between p1 and p2 in degrees': () => {
            let geo = require(appPath + 'lib/geo-vincenty');
            let result = geo.initialBearing(
                { lat: 70.3369224, lon: 30.3411273 },
                { lat: 59.8939528, lon: 10.6450348 }
            );
            assert.equals(result, 227.7704951964118);
        },

        'finalBearing between p1 and p2 in degrees': () => {
            let geo = require(appPath + 'lib/geo-vincenty');
            let result = geo.finalBearing(
                { lat: 70.3369224, lon: 30.3411273 },
                { lat: 59.8939528, lon: 10.6450348 }
            );
            assert.equals(result, 209.79851310389347);
        },

        'destinationPoint from p1 with distance and bearing': () => {
            let geo = require(appPath + 'lib/geo-vincenty');
            let result = geo.destinationPoint(
                { lat: 70.3705708, lon: 31.1049573 },
                10000, 360
            );
            assert.equals(result, { lat: 70.46020285321445, lon: 31.104957300000027 });
        },

        'finalBearingOn from p1 with distance and bearing': () => {
            let geo = require(appPath + 'lib/geo-vincenty');
            let result = geo.finalBearingOn(
                { lat: 70.3705708, lon: 31.1049573 },
                1000000, 300
            );
            assert.equals(result, 273.79203557987137);
        }
    }
});
