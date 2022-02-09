const path = require('path');
const appPath = path.normalize(__dirname + '/../');
const geoLib = require(appPath + 'lib/geo-lib');

const result = geoLib.distance({
    p1: { lat: 70.3369224, lon: 30.3411273 },
    p2: { lat: 59.8939528, lon: 10.6450348 }
});

console.log(result);
// {
//   distance: 1468.2753298955777,
//   unit: 'km',
//   method: 'haversine',
//   bearing: 218.03212341269622
// }
