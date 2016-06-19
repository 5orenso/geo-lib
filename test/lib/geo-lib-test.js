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

buster.testCase('lib/geo-lib', {
    setUp: () => {
    },
    tearDown: () => {
        delete require.cache[require.resolve(appPath + 'lib/geo-lib')];
    },
    'Calculate distance': {
        'with haversine regular object input': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance({
                p1: { lat: 70.3369224, lon: 30.3411273 },
                p2: { lat: 59.8939528, lon: 10.6450348 }
            });
            assert.equals(result, {
                distance: 1468.28,
                unit: 'km',
                method: 'haversine'
            });
        },

        'with haversine array of arrays input': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance([
                [70.3369224, 30.3411273],
                [59.8939528, 10.6450348]
            ]);
            assert.equals(result, {
                distance: 1468.28,
                unit: 'km',
                method: 'haversine'
            });
        },

        'with haversine array of objects input': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance([
                { lat: 70.3369224, lon: 30.3411273 },
                { lat: 59.8939528, lon: 10.6450348 }
            ]);
            assert.equals(result, {
                distance: 1468.28,
                unit: 'km',
                method: 'haversine'
            });
        },

        'with haversine array of numbers input': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance([
                70.3369224, 30.3411273,
                59.8939528, 10.6450348
            ]);
            assert.equals(result, {
                distance: 1468.28,
                unit: 'km',
                method: 'haversine'
            });
        },

        'with vincenty': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance({
                p1: { lat: 70.3369224, lon: 30.3411273 },
                p2: { lat: 59.8939528, lon: 10.6450348 },
                method: 'vincenty'
            });
            assert.equals(result, {
                distance: 1472.86,
                unit: 'km',
                method: 'vincenty'
            });
        },

        'with haversine and with seconds between points': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance({
                p1: { lat: 70.3369224, lon: 30.3411273 },
                p2: { lat: 59.8939528, lon: 10.6450348 },
                timeUsed: 86400 * 5
            });
            assert.equals(result, {
                distance: 1468.28,
                method: 'haversine',
                speedKph: 12.24,
                speedMph: 7.61,
                speedMpk: '5:54',
                timeUsedInSeconds: 432000,
                unit: 'km'
            });
        }
    },

    'Calculate distance failures': {
        'with haversine failure with missing p1': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            assert.exception(function() {
                myapp.distance({
                    p2: {lat: 59.8939528, lon: 10.6450348}
                });
            }, 'typeError');
        },
        'with haversine failure with missing p2': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            assert.exception(function() {
                myapp.distance({
                    p1: {lat: 59.8939528, lon: 10.6450348}
                });
            }, 'typeError');
        },
        'with haversine failure with missing p1 and p2': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            assert.exception(function() {
                myapp.distance();
            }, 'typeError');
        }
    },

    'Points and polygons': {
        'isPointInPoly where point is inside poly': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointIsInsidePoly([
                { x: 70.403203, y: 31.055603 },
                { x: 70.364476, y: 31.089935 },
                { x: 70.361707, y: 31.107788 },
                { x: 70.363091, y: 31.132507 },
                { x: 70.367244, y: 31.140747 },
                { x: 70.375087, y: 31.154480 },
                { x: 70.379699, y: 31.172333 },
                { x: 70.387536, y: 31.179199 },
                { x: 70.397214, y: 31.164093 },
                { x: 70.403203, y: 31.129761 },
                { x: 70.405506, y: 31.100922 },
                { x: 70.405506, y: 31.062469 },
                { x: 70.403663, y: 31.056976 }
            ], { x: 70.374164, y: 31.117401 });
            assert.equals(result, true);
        },

        'isPointInPoly where point is inside poly with poly as array of arrays': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointIsInsidePoly([
                [70.403203, 31.055603],
                [70.364476, 31.089935],
                [70.361707, 31.107788],
                [70.363091, 31.132507],
                [70.367244, 31.140747],
                [70.375087, 31.154480],
                [70.379699, 31.172333],
                [70.387536, 31.179199],
                [70.397214, 31.164093],
                [70.403203, 31.129761],
                [70.405506, 31.100922],
                [70.405506, 31.062469],
                [70.403663, 31.056976]
            ], { x: 70.374164, y: 31.117401 });
            assert.equals(result, true);
        },

        'isPointInPoly where point is inside poly with point as array': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointIsInsidePoly([
                [70.403203, 31.055603],
                [70.364476, 31.089935],
                [70.361707, 31.107788],
                [70.363091, 31.132507],
                [70.367244, 31.140747],
                [70.375087, 31.154480],
                [70.379699, 31.172333],
                [70.387536, 31.179199],
                [70.397214, 31.164093],
                [70.403203, 31.129761],
                [70.405506, 31.100922],
                [70.405506, 31.062469],
                [70.403663, 31.056976]
            ], [70.374164, 31.117401]);
            assert.equals(result, true);
        },

        'isPointInPoly where point is outside poly': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointIsInsidePoly([
                { x: 70.403203, y: 31.055603 },
                { x: 70.364476, y: 31.089935 },
                { x: 70.361707, y: 31.107788 },
                { x: 70.363091, y: 31.132507 },
                { x: 70.367244, y: 31.140747 },
                { x: 70.375087, y: 31.154480 },
                { x: 70.379699, y: 31.172333 },
                { x: 70.387536, y: 31.179199 },
                { x: 70.397214, y: 31.164093 },
                { x: 70.403203, y: 31.129761 },
                { x: 70.405506, y: 31.100922 },
                { x: 70.405506, y: 31.062469 },
                { x: 70.403663, y: 31.056976 }
            ], {x: 59.8939528, y: 10.6450348});
            assert.equals(result, false);
        }
    }
});
