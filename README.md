# Geo-lib module for fast calculations of distance, speed and heading

[![Build Status](https://travis-ci.org/5orenso/geo-lib.svg?branch=master)](https://travis-ci.org/5orenso/geo-lib)
[![Coverage Status](https://coveralls.io/repos/github/5orenso/geo-lib/badge.svg?branch=master)](https://coveralls.io/github/5orenso/geo-lib?branch=master)

The start of my new geo-lib module. This Node.js module is built with performance and speed as priority one. 

Why did I start this module?
I need a module that is able to do millions of calculations every minute. This module is going to be developed
according to these demands. I'll always be looking out for de-optimization inside the V8 engine.


### Howto get started using this module
```bash
$ npm install geo-lib --save
```

Then use it in your code.

To find the distance between 2 geo points:
```javascript
let geoLib = require('geo-lib');
let result = geoLib.distance({
    p1: { lat: 70.3369224, lon: 30.3411273 },
    p2: { lat: 59.8939528, lon: 10.6450348 }
});
// result = {
//   distance: 1468.28,
//   unit: 'km',
//   method: 'haversine'
// }
```

Or even in a simpler way:
```javascript
let geoLib = require('geo-lib');
let result = geoLib.distance([
    [70.3369224, 30.3411273],
    [59.8939528, 10.6450348]
]);
// result = {
//   distance: 1468.28,
//   unit: 'km',
//   method: 'haversine'
// }
```

To find the distance and speed between 2 geo points:
```javascript
let geoLib = require('geo-lib');
let result = geoLib.distance({
    p1: { lat: 70.3369224, lon: 30.3411273 },
    p2: { lat: 59.8939528, lon: 10.6450348 },
    timeUsed: 86400 * 5
});
// result = {
//   distance: 1468.28,
//   method: 'haversine',
//   speedKph: 12.24,
//   speedMph: 7.61,
//   speedMpk: '4:54',
//   timeUsedInSeconds: 432000,
//   unit: 'km'
// }
```

To check if a point is inside a polygon:
```javascript
let geoLib = require('geo-lib');
let result = geoLib.pointIsInsidePoly([
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
// result = true                               
```


----------

### Howto to get started with contributions
```bash
$ git clone git@github.com:5orenso/geo-lib.git
$ cd geo-lib/
$ npm install
```

Start developing. Remember to start watching your files:
```bash 
$ grunt watch
```

### Howto contribute

```bash
$ git clone git@github.com:5orenso/geo-lib.git
```
Do your magic and create a pull request.


### Howto report issues
Use the [Issue tracker](https://github.com/5orenso/geo-lib/issues)


### Howto update CHANGELOG.md
```bash
$ bash ./changelog.sh
```

### Howto upgrade modules
```bash
$ npm install -g npm-check-updates
$ ncu -u
$ npm install --save --no-optional
```


### HOWTO upgrade dev environment
```bash
$ npm install buster --save-dev
$ npm install buster-istanbul --save-dev
$ npm install grunt --save-dev
$ npm install grunt-buster --save-dev
$ npm install grunt-contrib-jshint --save-dev
$ npm install grunt-contrib-nodeunit --save-dev
$ npm install grunt-contrib-watch --save-dev
$ npm install grunt-coveralls --save-dev
$ npm install grunt-jscs --save-dev
$ npm install grunt-nodemon --save-dev
$ npm install grunt-shell --save-dev
$ npm install grunt-jsdoc --save-dev

```


## More about the author

- Twitter: [@sorenso](https://twitter.com/sorenso)
- Instagram: [@sorenso](https://instagram.com/sorenso)
- Facebook: [@sorenso](https://facebook.com/sorenso)
