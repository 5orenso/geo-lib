const path = require('path');
const appPath = path.normalize(__dirname + '/../');
const geoLib = require(appPath + 'lib/geo-lib');

const result = geoLib.distance({
    p1: { lat: 70.3369224, lon: 30.3411273 },
    p2: { lat: 59.8939528, lon: 10.6450348 },
    method: 'vincenty'
});

console.log(result);
// {
//   distance: 1472.85899,
//   unit: 'km',
//   method: 'vincenty',
//   bearing: 218.03212341269622
// }
