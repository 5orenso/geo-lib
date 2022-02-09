const path = require('path');
const appPath = path.normalize(__dirname + '/../');
const geoLib = require(appPath + 'lib/geo-lib');

const result = geoLib.polygonOverlapsPolygon([
        60.21799, 10.40405,
        59.36119, 8.80004,
        59.21531, 11.39282
    ], [
        59.86136, 11.52465,
        59.02924, 10.51391,
        59.0688, 12.63427
    ]);

console.log(result);
// true

