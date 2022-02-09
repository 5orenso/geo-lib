const path = require('path');
const appPath = path.normalize(__dirname + '/../');
const geoLib = require(appPath + 'lib/geo-lib');

const result = geoLib.generatePoints([70.000, 30.000], [70.010, 30.010], 300);

console.log(result);
// [
//   [ 70.002552829513, 30.00255254811713 ],
//   [ 70.00510562247304, 30.00510572133135 ],
//   [ 70.00765837886604, 30.00765951987357 ]
// ]