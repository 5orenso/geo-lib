/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
var config = module.exports;

config['My tests'] = {
    environment: 'node',
    rootPath: '../',
    tests: [
        'test/**/*-test.js'
    ],
    'buster-istanbul': {
        outputDirectory: 'coverage',
        format: 'lcov'
    },
    sources: [
        'lib/**/**/*.js',
        'app/**/*.js'
    ],
    extensions: [
        require('buster-istanbul')
    ]
};
