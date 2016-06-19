/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';
let path = require('path'),
    appPath = path.normalize(__dirname + '/../'),
    geoVincenty = require(appPath + 'lib/geo-vincenty');

/**
 * Module dealing with geo stuff.
 * @param {hash} opt - Constructor options.
 * @property {string} [config={}] The config files.
 * @constructor
 */
function GeoLib(opt) {
    this.opts = opt || {};
    if (this.opts.debug) {
        console.log(this.opts);
    }
}

function toRad(number) {
    return number * Math.PI / 180;
}

/*
 The "Earth radius" R varies from 6356.752 km at the poles to 6378.137 km at the equator. More importantly, the radius
 of curvature of a north-south line on the earth's surface is 1% greater at the poles (≈6399.594 km) than at the
 equator (≈6335.439 km)— so the haversine formula and law of cosines can't be guaranteed correct to better than 0.5%.
 More accurate methods that consider the Earth's ellipticity are given by Vincenty's formulae and the other formulas
 in the geographical distance article.
 https://en.wikipedia.org/wiki/Haversine_formula
 */
function haversine(d) {
    return Math.sin(d / 2) * Math.sin(d / 2);
}

function distanceHaversine(p1, p2) {
    let earthRadius = 6371; // https://www.google.no/?q=earth+radius
    let dLat = toRad(p2.lat - p1.lat);
    let dLon = toRad(p2.lon - p1.lon);
    let centralAngle = haversine(dLat) + Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * haversine(dLon);
    let distanceKm = earthRadius * 2 * Math.atan2(Math.sqrt(centralAngle), Math.sqrt(1 - centralAngle));
    return (distanceKm).toFixed(2);
}

/**
 * @typedef Distance
 * @type Object
 * @property {number} distance The distance value
 * @property {string} unit The unit for the distance
 */
/**
 * Get distance between 2 geo points.
 * @param {object} opt - Input object.
 * @property {object} p1   Latitude, longitude for start point. { lat: number, lon: number}.
 * @property {object} p2   Latitude, longitude for destination point. { lat: number, lon: number}.
 * @property {string} [unit] Distance unit.
 * @property {string} [method] Calculation method. (haversine, vincenty)
 *
 * @example
 * var res = geo.distance({
 *     lat1: 70.3369224, lon1: 30.3411273,
 *     lat2: 59.8939528, lon2: 10.6450348,
 *     unit: 'km'
 * });
 * console.log(res.distance, res.unit);
 * // 1447.35 km
 *
 * @returns {Distance} distance - Object with the response.
 */
GeoLib.prototype.distance = function(opt) {
    if (typeof opt.p1 !== 'object') {
        throw new TypeError('p1 is not object');
    } else if (typeof opt.p2 !== 'object') {
        throw new TypeError('p2 is not object');
    }
    let distance;
    let method = 'haversine';
    if (opt.method === 'vincenty') {
        method = opt.method;
        distance = geoVincenty.distance(
            opt.p1,
            opt.p2
        );
        distance = (distance / 1000).toFixed(2);
    } else {
        distance = distanceHaversine(opt.p1, opt.p2);
    }
    let result = {
        distance: parseFloat(distance), // 1447.35,
        unit: 'km',
        method: method
    };
    if (opt.timeUsed) {
        result.timeUsedInSeconds = opt.timeUsed;
        result.speedKph = Number((result.distance / (opt.timeUsed / 3600)).toFixed(2));
        result.speedMph = Number((result.speedKph * 0.621371).toFixed(2));
        // mpk = 60 ÷ (kph)
        let mpkSec = (60 / result.speedKph * 60).toFixed(0);
        let mpkMin = (mpkSec / 60).toFixed(0);
        result.speedMpk = mpkMin + ':' + (mpkSec % 60);
    }

    return result;
};

module.exports = new GeoLib();
