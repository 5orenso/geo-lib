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

        'with haversine array of objects input x & y': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.distance([
                { y: 70.3369224, x: 30.3411273 },
                { y: 59.8939528, x: 10.6450348 }
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
                speedMpk: '4:54',
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
            let result = myapp.pointInsidePolygon({ lat: 70.374164, lon: 31.117401 },
                [
                    { lat: 70.403203, lon: 31.055603 },
                    { lat: 70.364476, lon: 31.089935 },
                    { lat: 70.361707, lon: 31.107788 },
                    { lat: 70.363091, lon: 31.132507 },
                    { lat: 70.367244, lon: 31.140747 },
                    { lat: 70.375087, lon: 31.154480 },
                    { lat: 70.379699, lon: 31.172333 },
                    { lat: 70.387536, lon: 31.179199 },
                    { lat: 70.397214, lon: 31.164093 },
                    { lat: 70.403203, lon: 31.129761 },
                    { lat: 70.405506, lon: 31.100922 },
                    { lat: 70.405506, lon: 31.062469 },
                    { lat: 70.403663, lon: 31.056976 }
            ]);
            assert.equals(result, true);
        },

        'isPointInPoly where point is inside poly x & y': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointInsidePolygon({ y: 70.374164, x: 31.117401 },
                [
                    { y: 70.403203, x: 31.055603 },
                    { y: 70.364476, x: 31.089935 },
                    { y: 70.361707, x: 31.107788 },
                    { y: 70.363091, x: 31.132507 },
                    { y: 70.367244, x: 31.140747 },
                    { y: 70.375087, x: 31.154480 },
                    { y: 70.379699, x: 31.172333 },
                    { y: 70.387536, x: 31.179199 },
                    { y: 70.397214, x: 31.164093 },
                    { y: 70.403203, x: 31.129761 },
                    { y: 70.405506, x: 31.100922 },
                    { y: 70.405506, x: 31.062469 },
                    { y: 70.403663, x: 31.056976 }
                ]);
            assert.equals(result, true);
        },

        'isPointInPoly where point is inside poly with poly as array of arrays': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointInsidePolygon({ lat: 70.374164, lon: 31.117401 },
                [
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
            ]);
            assert.equals(result, true);
        },

        'isPointInPoly where point is inside poly with point as array': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointInsidePolygon([70.374164, 31.117401],
                [
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
            ]);
            assert.equals(result, true);
        },

        'isPointInPoly where point is inside poly as array of numbers with point as array': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointInsidePolygon([70.374164, 31.117401], [
                70.403203, 31.055603,
                70.364476, 31.089935,
                70.361707, 31.107788,
                70.363091, 31.132507,
                70.367244, 31.140747,
                70.375087, 31.154480,
                70.379699, 31.172333,
                70.387536, 31.179199,
                70.397214, 31.164093,
                70.403203, 31.129761,
                70.405506, 31.100922,
                70.405506, 31.062469,
                70.403663, 31.056976
            ]);
            assert.equals(result, true);
        },

        'isPointInPoly where point is outside poly': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointInsidePolygon({lat: 59.8939528, lon: 10.6450348},
                [
                    { lat: 70.403203, lon: 31.055603 },
                    { lat: 70.364476, lon: 31.089935 },
                    { lat: 70.361707, lon: 31.107788 },
                    { lat: 70.363091, lon: 31.132507 },
                    { lat: 70.367244, lon: 31.140747 },
                    { lat: 70.375087, lon: 31.154480 },
                    { lat: 70.379699, lon: 31.172333 },
                    { lat: 70.387536, lon: 31.179199 },
                    { lat: 70.397214, lon: 31.164093 },
                    { lat: 70.403203, lon: 31.129761 },
                    { lat: 70.405506, lon: 31.100922 },
                    { lat: 70.405506, lon: 31.062469 },
                    { lat: 70.403663, lon: 31.056976 }
            ]);
            assert.equals(result, false);
        },

        'isPointInPoly where point is outside poly x & y': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.pointInsidePolygon({lat: 59.8939528, lon: 10.6450348},
                [
                    { y: 70.403203, x: 31.055603 },
                    { y: 70.364476, x: 31.089935 },
                    { y: 70.361707, x: 31.107788 },
                    { y: 70.363091, x: 31.132507 },
                    { y: 70.367244, x: 31.140747 },
                    { y: 70.375087, x: 31.154480 },
                    { y: 70.379699, x: 31.172333 },
                    { y: 70.387536, x: 31.179199 },
                    { y: 70.397214, x: 31.164093 },
                    { y: 70.403203, x: 31.129761 },
                    { y: 70.405506, x: 31.100922 },
                    { y: 70.405506, x: 31.062469 },
                    { y: 70.403663, x: 31.056976 }
                ]);
            assert.equals(result, false);
        },

        'linesIntersect where this should be true geo': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.linesIntersect(
                {lat: 59.75639, lon: 6.67968}, {lat: 61.15383, lon: 11.87622},
                {lat: 61.51745, lon: 8.15185}, {lat: 59.75086, lon: 11.1621}
            );
            assert.equals(result, true);
        },

        'linesIntersect where this should be true geo x & y': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.linesIntersect(
                {y: 59.75639, x: 6.67968}, {y: 61.15383, x: 11.87622},
                {y: 61.51745, x: 8.15185}, {y: 59.75086, x: 11.1621}
            );
            assert.equals(result, true);
        },

        'linesIntersect where this should be true geo array': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.linesIntersect(
                [59.75639, 6.67968], [61.15383, 11.87622],
                [61.51745, 8.15185], [59.75086, 11.1621]
            );
            assert.equals(result, true);
        },

        'linesIntersect where this should be true': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.linesIntersect(
                {lat:0, lon:0}, {lat:3, lon:3},
                {lat:0, lon:2}, {lat:4, lon:1}
            );
            assert.equals(result, true);
        },

        'linesIntersect where this should be false': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.linesIntersect(
                {lat:0, lon:0}, {lat:3, lon:3},
                {lat:0, lon:0}, {lat:3, lon:3}
            );
            assert.equals(result, true);
        },

        //          (2,5)         (7,5)
        // 5 |      |------------|
        // 4 |(0,3) |  (3,3)     |
        // 3 |--------|(2,2)     |(7,2)
        // 2 |      |-|-----------
        // 1 |(0,0)   |(3,0)
        // 0 -------------------------
        //   0  1  2  3  4  5  6  7  8
        'polygonOverlapsPolygon where point is inside and this should be true': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.polygonOverlapsPolygon(
                [
                    {lat:0, lon:0}, {lat:0, lon:3},
                    {lat:3, lon:3}, {lat:3, lon:0}
                ],
                [
                    {lat:2, lon:2}, {lat:2, lon:5},
                    {lat:7, lon:5}, {lat:7, lon:2}
                ]
            );
            assert.equals(result, true);
        },

        //             (3,6)       (7,6)
        // 6 |        |-----------|
        // 5 |   (1,4)|           |   (8,4)
        // 4 |  |--------------------|
        // 3 |  |     |           |  |
        // 2 |  |(1,1)|           |  |(8,1)
        // 1 |  |--------------------|
        // 0 ---------|(3,0)------|(7,0)---
        //   0  1  2  3  4  5  6  7  8
        'polygonOverlapsPolygon where no points is inside this should be true': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.polygonOverlapsPolygon(
                [
                    {lat:1, lon:1}, {lat:1, lon:4},
                    {lat:8, lon:4}, {lat:8, lon:1}
                ],
                [
                    {lat:3, lon:0}, {lat:3, lon:6},
                    {lat:7, lon:6}, {lat:7, lon:0}
                ]
            );
            assert.equals(result, true);
        },

        'polygonOverlapsPolygon where geo array of array is real this should be true': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.polygonOverlapsPolygon(
                [
                    [60.21799, 10.40405],
                    [59.36119, 8.80004],
                    [59.21531, 11.39282]
                ],
                [
                    [59.86136, 11.52465],
                    [59.02924, 10.51391],
                    [59.0688, 12.63427]
                ]
            );
            assert.equals(result, true);
        },

        'polygonOverlapsPolygon where geo array is real this should be true': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.polygonOverlapsPolygon([
                    60.21799, 10.40405,
                    59.36119, 8.80004,
                    59.21531, 11.39282
                ], [
                    59.86136, 11.52465,
                    59.02924, 10.51391,
                    59.0688, 12.63427
                ]);
            assert.equals(result, true);
        },

        'polygonOverlapsPolygon where no points is inside this should be true with x & y': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.polygonOverlapsPolygon(
                [
                    {y:1, x:1}, {y:1, x:4},
                    {y:8, x:4}, {y:8, x:1}
                ],
                [
                    {y:3, x:0}, {y:3, x:6},
                    {y:7, x:6}, {y:7, x:0}
                ]
            );
            assert.equals(result, true);
        },

        'polygonOverlapsPolygon where no points is inside this should be true with array of array': () => {
            let myapp = require(appPath + 'lib/geo-lib');
            let result = myapp.polygonOverlapsPolygon(
                [
                    [1,1], [1,4],
                    [8,4], [8,1]
                ],
                [
                    [3, 0], [3, 6],
                    [7, 6], [7, 0]
                ]
            );
            assert.equals(result, true);
        }

    }
});
