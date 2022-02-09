const path = require('path');
const appPath = path.normalize(__dirname + '/../');
const geoLib = require(appPath + 'lib/geo-lib');

const result = geoLib.linesIntersect(
    {lat: 59.75639, lon: 6.67968}, {lat: 61.15383, lon: 11.87622},
    {lat: 61.51745, lon: 8.15185}, {lat: 59.75086, lon: 11.1621}
);

console.log(result);
// true

