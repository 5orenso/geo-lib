/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

var buster = require('buster'),
    assert = buster.assert,
    path = require('path'),
    appPath = path.normalize(__dirname + '/../');

buster.testCase('lib/my-app', {
    setUp: () => {
    },
    tearDown: () => {
        delete require.cache[require.resolve(appPath + 'lib/geo-lib')];
    },
    'Test module:': {
        'exposed run function w/options': () => {
            let app = require(appPath + 'app/app');
            let result = app.distance({
                p1: { lat: 70.3369224, lon: 30.3411273 },
                p2: { lat: 59.8939528, lon: 10.6450348 },
                unit: 'km'
            });
            assert.equals(result, {
                distance: 1468.28,
                unit: 'km',
                method: 'haversine'
            });
        }

    }
});
