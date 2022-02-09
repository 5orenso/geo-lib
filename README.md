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
// {
//   distance: 1468.2753298955777,
//   unit: 'km',
//   method: 'haversine',
//   bearing: 218.03212341269622
// }
```

Or even in a simpler way:
```javascript
let geoLib = require('geo-lib');
let result = geoLib.distance([
    [70.3369224, 30.3411273],
    [59.8939528, 10.6450348]
]);
// {
//   distance: 1468.2753298955777,
//   unit: 'km',
//   method: 'haversine',
//   bearing: 218.03212341269622
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
// {
//   distance: 1468.2753298955777,
//   unit: 'km',
//   method: 'haversine',
//   bearing: 218.03212341269622,
//   timeUsedInSeconds: 432000,
//   speedKph: 12.235627749129813,
//   speedMph: 7.602864250104541,
//   speedMpk: '4:54.22274637735927'
// }
```

Create new point in distance and bearing from a given point:
```javascript
let geoLib = require('geo-lib');
const result = geoLib.createCoord([70.000, 30.000], 360, 10000);
console.log(result);
// [ 70.08993216059186, 29.999999999999964 ]
```

Create new points between 2 given points:
```javascript
let geoLib = require('geo-lib');
const result = geoLib.generatePoints([70.000, 30.000], [70.010, 30.010]);

console.log(result);
// [
//   [ 70.00085094723158, 30.000850779931362 ],
//   [ 70.00170189040277, 30.001701629300936 ],
//   [ 70.002552829513, 30.00255254811713 ],
//   [ 70.00340376456182, 30.0034035363886 ],
//   [ 70.00425469554865, 30.004254594123793 ],
//   [ 70.00510562247304, 30.00510572133135 ],
//   [ 70.00595654533441, 30.005956918019837 ],
//   [ 70.00680746413225, 30.006808184197695 ],
//   [ 70.00765837886604, 30.00765951987357 ],
//   [ 70.00850928953531, 30.00851092505601 ],
//   [ 70.00936019613945, 30.009362399753574 ]
// ]
```

Create new points between 2 given points with fixed distance:
```javascript
let geoLib = require('geo-lib');
const result = geoLib.generatePoints([70.000, 30.000], [70.010, 30.010], 300);

console.log(result);
// [
//   [ 70.002552829513, 30.00255254811713 ],
//   [ 70.00510562247304, 30.00510572133135 ],
//   [ 70.00765837886604, 30.00765951987357 ]
// ]
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
// true
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
// true
```

To check if 2 lines intersects:
```javascript
let geoLib = require('geo-lib');
let result = geoLib.linesIntersect(
    {lat: 59.75639, lon: 6.67968}, {lat: 61.15383, lon: 11.87622},
    {lat: 61.51745, lon: 8.15185}, {lat: 59.75086, lon: 11.1621}
);
// true
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
$ sudo npm install -g npm-check-updates
$ ncu -u -a
$ npm install --no-optional
```


## Contributions and feedback:

We ❤️ contributions and feedback.

If you want to contribute, please check out the [CONTRIBUTING.md](CONTRIBUTING.md) file.

If you have any question or suggestion create an issue.

Bug reports should always be done with a new issue.


## Other Resources

* [AWS Basic setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-base)
* [AWS Lambda boilerplate](https://github.com/5orenso/aws-lambda-boilerplate)
* [Automated AWS Lambda update](https://github.com/5orenso/aws-lambda-autodeploy-lambda)
* [AWS API Gateway setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-api-gateway)
* [AWS IoT setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-iot)



## More about the author

- Twitter: [@sorenso](https://twitter.com/sorenso)
- Instagram: [@sorenso](https://instagram.com/sorenso)
- Facebook: [@sorenso](https://facebook.com/sorenso)
