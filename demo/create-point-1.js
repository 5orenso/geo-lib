const path = require('path');
const appPath = path.normalize(__dirname + '/../');
const geoLib = require(appPath + 'lib/geo-lib');

const result = geoLib.createCoord([70.000, 30.000], 360, 10000);

console.log(result);
// [ 70.08993216059186, 29.999999999999964 ]
