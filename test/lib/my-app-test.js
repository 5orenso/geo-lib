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

buster.testCase('lib/my-app', {
    setUp: () => {
    },
    tearDown: () => {
        delete require.cache[require.resolve(appPath + 'lib/my-app')];
    },
    'Test module:': {
        'dummy sync test': () => {
            assert(true);
        },

        'dummy async test': (done) => {
            // Do some async stuff and call done.
            assert(true);
            done();
        },

        'dummy async w/promises test': (done) => {
            function promiseTest(input) {
                return new Promise((resolve, reject) => {
                    if (input) {
                        resolve(input);
                    } else {
                        reject(new Error(input));
                    }
                });
            }
            promiseTest(true)
                .then(() => {
                    assert(true);
                    done();
                })
                .catch((error) => {
                    console.log(error);
                    assert(false);
                });
        },

        'exposed run function w/options': () => {
            let MyApp = require(appPath + 'lib/my-app');
            let myApp = new MyApp();
            let result = myApp.run();
            assert.equals(result, 'Yo!');
        }

    }
});
