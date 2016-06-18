/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

function MyApp(opt) {
    let opts = opt || {};
    if (opts.debug) {
        console.log(opts);
    }
}

MyApp.prototype.run = () => {
    // Start my application and do all your stuff.
    return MyApp.prototype.say('Yo!');
};

MyApp.prototype.say = (text) => {
    return text;
};

module.exports = MyApp;
