const path = require('path');
const appPath = path.normalize(__dirname + '/../');
const geoLib = require(appPath + 'lib/geo-lib');

const result = geoLib.distance({
    p1: { lat: 70.3369224, lon: 30.3411273 },
    p2: { lat: 59.8939528, lon: 10.6450348 },
    timeUsed: 86400 * 5
});

console.log(result);
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
