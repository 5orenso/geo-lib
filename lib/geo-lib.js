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
 * @constructor
 */
function GeoLib() {
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
 * @property {number} distance  The distance value
 * @property {string} unit      The unit for the distance
 * @property {string} method    The method used to find the distance. (haversine, vincenty)
 * @property {number} speedKph  The speed in Km/hour
 * @property {number} speedMph  The speed in Miles/hour
 * @property {string} speedMpk  The speed in Minutes Per Km.
 * @property {number} timeUsedInSeconds  Time in seconds used between points.
 */
/**
 * Get distance between 2 geo points.
 * @param    {object} opts     Input object.
 * @property {object} p1       Latitude, longitude for start point. { lat: number, lon: number}.
 * @property {object} p2       Latitude, longitude for destination point. { lat: number, lon: number}.
 * @property {string} [unit]   Distance unit.
 * @property {string} [method] Calculation method. (haversine, vincenty)
 *
 * @example
 * let geo = require(appPath + 'lib/geo-lib');
 * let res = geo.distance({
 *     lat1: 70.3369224, lon1: 30.3411273,
 *     lat2: 59.8939528, lon2: 10.6450348,
 *     unit: 'km'
 * });
 * console.log(res.distance, res.unit);
 * // 1447.35 km
 *
 * @returns {Distance} distance - Object with the response.
 */
GeoLib.prototype.distance = function distance(opts) {
    let opt;
    // Check the input to see if it's in one of the allowed formats.
    if (Array.isArray(opts) && Array.isArray(opts[0])) {
        //console.log('array of array');
        opt = {
            p1: { lat: opts[0][0], lon: opts[0][1]},
            p2: { lat: opts[1][0], lon: opts[1][1]}
        };
    } else if (Array.isArray(opts) && typeof opts[0] === 'object') {
        //console.log('array of objects');
        opt = {
            p1: {lat: opts[0].lat, lon: opts[0].lon},
            p2: {lat: opts[1].lat, lon: opts[1].lon}
        };
    } else if (Array.isArray(opts) && typeof opts[0] === 'number') {
        //console.log('array of numbers');
        opt = {
            p1: { lat: opts[0], lon: opts[1]},
            p2: { lat: opts[2], lon: opts[3]}
        };
    } else {
        opt = Object.assign({}, opts);
    }
    if (typeof opt.p1 !== 'object') {
        throw new TypeError('p1 is not object');
    } else if (typeof opt.p2 !== 'object') {
        throw new TypeError('p2 is not object');
    }
    // Start the magic.
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

/*
 Inspired by:
 https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 */
/**
 * @param    {array}  inputPolygon  Input polygon.
 * @property {object} x             Latitude for start point.
 * @property {object} y             Longitude for destination point.
 * @param    {object} inputPoint    Input point.
 *
 * @example
 * let geo = require(appPath + 'lib/geo-lib');
 * let result = geo.pointIsInsidePoly([
 *     { x: 70.403203, y: 31.055603 },
 *     { x: 70.364476, y: 31.089935 },
 *     { x: 70.361707, y: 31.107788 },
 *     { x: 70.363091, y: 31.132507 },
 *     { x: 70.367244, y: 31.140747 },
 *     { x: 70.375087, y: 31.154480 },
 *     { x: 70.379699, y: 31.172333 },
 *     { x: 70.387536, y: 31.179199 },
 *     { x: 70.397214, y: 31.164093 },
 *     { x: 70.403203, y: 31.129761 },
 *     { x: 70.405506, y: 31.100922 },
 *     { x: 70.405506, y: 31.062469 },
 *     { x: 70.403663, y: 31.056976 }
 *     ], {x: 70.374164, y: 31.117401});
 *
 * @returns {boolean} isInside - True or false.
 */
GeoLib.prototype.pointIsInsidePoly = function pointIsInsidePoly(inputPolygon, inputPoint) {
    let polygon = [],
        point = {};
    // Check if we have an array of arrays as input. If so make it an
    // array of objects.
    if (Array.isArray(inputPolygon) && Array.isArray(inputPolygon[0])) {
        for (let i = 0; i < inputPolygon.length; i++) {
            let p = {
                x: inputPolygon[i][0],
                y: inputPolygon[i][1]
            };
            polygon.push(p);
        }
    } else {
        polygon = inputPolygon.slice();
    }
    // Check if we have an array as input. If so, make it an object.
    if (Array.isArray(inputPoint)) {
        point = {
            x: inputPoint[0],
            y: inputPoint[1]
        };
    } else {
        point = Object.assign({}, inputPoint);
    }
    // Start the magic.
    let i,
        nvert = polygon.length,
        j = nvert - 1,
        c = false;
    for (i = 0; i < nvert; j = i++) {
        if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
            (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) /
            (polygon[j].y - polygon[i].y) + polygon[i].x)) {
            c = !c;
            //console.log(i, j, polygon[i].y, '>', point.y, c);
        }
    }
    return c;
};

module.exports = new GeoLib();
