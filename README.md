# Geo-lib module for fast calculations of distance, speed and heading

[![Build Status](https://travis-ci.org/5orenso/geo-lib.svg?branch=master)](https://travis-ci.org/5orenso/geo-lib)
[![Coverage Status](https://coveralls.io/repos/github/5orenso/geo-lib/badge.svg?branch=master)](https://coveralls.io/github/5orenso/geo-lib?branch=master)
[![GitHub version](https://badge.fury.io/gh/5orenso%2Fgeo-lib.svg)](https://badge.fury.io/gh/5orenso%2Fgeo-lib)
[![npm version](https://badge.fury.io/js/geo-lib.svg)](https://badge.fury.io/js/geo-lib)

[![NPM Stats](https://nodei.co/npm/geo-lib.png?downloads=true&downloadRank=true)](https://npmjs.org/packages/geo-lib/)


The start of my new geo-lib module. This Node.js module is built with performance and speed as priority one.

Why did I start this module?
I need a module that is able to do millions of calculations every minute. This module is going to be developed
according to these demands. I'll always be looking out for de-optimization inside the V8 engine.

If you don't follow instructions you will end up in [Null Island](http://www.wsj.com/articles/if-you-cant-follow-directions-youll-end-up-on-null-island-1468422251)

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
let result = geoLib.pointInsidePolygon([70.374164, 31.117401], [
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
// result = true                               
```

To check if 2 lines intersects:
```javascript
let geoLib = require('geo-lib');
let result = geoLib.linesIntersect(
    {lat: 59.75639, lon: 6.67968}, {lat: 61.15383, lon: 11.87622},
    {lat: 61.51745, lon: 8.15185}, {lat: 59.75086, lon: 11.1621}
);
// result = true                               
```

To check if 2 polygons overlaps:
```javascript
let geoLib = require('geo-lib');
let result = geoLib.polygonOverlapsPolygon([
        60.21799, 10.40405,
        59.36119, 8.80004,
        59.21531, 11.39282
    ], [
        59.86136, 11.52465,
        59.02924, 10.51391,
        59.0688, 12.63427
    ]);
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

### Howto update NPM module

1. Bump version inside `package.json`
2. Push all changes to Github.
3. Push all changes to npmjs.com: `$ bash ./npm-release.sh`.

### Howto check for vulnerabilities in modules
```bash
# Install Node Security Platform CLI
$ npm install nsp --global  

# From inside your project directory
$ nsp check  
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
$ npm install grunt-retire --save-dev
```

## More about the author

- Twitter: [@sorenso](https://twitter.com/sorenso)
- Instagram: [@sorenso](https://instagram.com/sorenso)
- Facebook: [@sorenso](https://facebook.com/sorenso)
