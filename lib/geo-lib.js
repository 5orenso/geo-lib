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
 *     p1: { lat: 70.3369224, lon: 30.3411273 },
 *     p2: { lat: 59.8939528, lon: 10.6450348 },
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
            p1: {
                lat: (typeof opts[0].lat === 'undefined' ? opts[0].y : opts[0].lat),
                lon: (typeof opts[0].lon === 'undefined' ? opts[0].x : opts[0].lon)
            },
            p2: {
                lat: (typeof opts[1].lat === 'undefined' ? opts[1].y : opts[1].lat),
                lon: (typeof opts[1].lon === 'undefined' ? opts[1].x : opts[1].lon)
            }
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
    // --------------------------------------------------------------------------------
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
        let mpkMin = Math.floor(mpkSec / 60);
        result.speedMpk = mpkMin + ':' + (mpkSec % 60);
    }

    return result;
};

/*
 Inspired by:
 https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 */
function isPointInsidePoly(point, polygon) {
    let i,
        nvert = polygon.length,
        j = nvert - 1,
        c = false;
    for (i = 0; i < nvert; j = i++) {
        if (((polygon[i].lon > point.lon) !== (polygon[j].lon > point.lon)) &&
            (point.lat < (polygon[j].lat - polygon[i].lat) * (point.lon - polygon[i].lon) /
            (polygon[j].lon - polygon[i].lon) + polygon[i].lat)) {
            c = !c;
            //console.log(i, j, polygon[i].lon, '>', point.lon, c);
        }
    }
    return c;
}

/**
 * @param    {object} inputPoint    Input point.
 * @param    {array}  inputPolygon  Input polygon.
 * @property {object} lat           Latitude for start point.
 * @property {object} lon           Longitude for destination point.
 *
 * @example
 * let geo = require(appPath + 'lib/geo-lib');
 * let result = geo.pointInsidePolygon({lat: 70.374164, lon: 31.117401}, [
 *     { lat: 70.403203, lon: 31.055603 },
 *     { lat: 70.364476, lon: 31.089935 },
 *     { lat: 70.361707, lon: 31.107788 },
 *     { lat: 70.363091, lon: 31.132507 },
 *     { lat: 70.367244, lon: 31.140747 },
 *     { lat: 70.375087, lon: 31.154480 },
 *     { lat: 70.379699, lon: 31.172333 },
 *     { lat: 70.387536, lon: 31.179199 },
 *     { lat: 70.397214, lon: 31.164093 },
 *     { lat: 70.403203, lon: 31.129761 },
 *     { lat: 70.405506, lon: 31.100922 },
 *     { lat: 70.405506, lon: 31.062469 },
 *     { lat: 70.403663, lon: 31.056976 }
 *     ]);
 *
 * @returns {boolean} pointInsidePolygon - True or false.
 */
GeoLib.prototype.pointInsidePolygon = function pointInsidePolygon(inputPoint, inputPolygon) {
    let polygon = [],
        point = {};
    // Check if we have an array of arrays as input. If so make it an
    // array of objects.
    if (Array.isArray(inputPolygon) && typeof inputPolygon[0] === 'number') {
        for (let i = 0; i < inputPolygon.length; i += 2) {
            let p = {
                lat: inputPolygon[i],
                lon: inputPolygon[i + 1]
            };
            polygon.push(p);
        }
    } else if (Array.isArray(inputPolygon) && Array.isArray(inputPolygon[0])) {
        for (let i = 0; i < inputPolygon.length; i++) {
            let p = {
                lat: inputPolygon[i][0],
                lon: inputPolygon[i][1]
            };
            polygon.push(p);
        }
    } else {
        for (let i = 0; i < inputPolygon.length; i++) {
            polygon.push({
                lat: (typeof inputPolygon[i].lat === 'undefined' ? inputPolygon[i].y : inputPolygon[i].lat),
                lon: (typeof inputPolygon[i].lon === 'undefined' ? inputPolygon[i].x : inputPolygon[i].lon)
            });
        }
    }
    // Check if we have an array as input. If so, make it an object.
    if (Array.isArray(inputPoint)) {
        point = {
            lat: inputPoint[0],
            lon: inputPoint[1]
        };
    } else {
        point = {
            lat: (typeof inputPoint.lat === 'undefined' ? inputPoint.y : inputPoint.lat),
            lon: (typeof inputPoint.lon === 'undefined' ? inputPoint.x : inputPoint.lon)
        };
    }
    // --------------------------------------------------------------------------------
    // Start the magic.
    return isPointInsidePoly(point, polygon);
};

// Given three colinear points line1p1, line1p2, point, the function checks if
// point lies on line segment 'line'
function isPointOnLineSegment(line1p1, line1p2, point) {
    if (line1p2.lat <= Math.max(line1p1.lat, point.lat) && line1p2.lat >= Math.min(line1p1.lat, point.lat) &&
        line1p2.lon <= Math.max(line1p1.lon, point.lon) && line1p2.lon >= Math.min(line1p1.lon, point.lon)) {
        return true;
    }
    return false;
}

// To find findPointOrientation of ordered triplet (line1p1, line1p2, point).
// The function returns following values
// 0 --> line1p1, line1p2 and point are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function findPointOrientation(line1p1, line1p2, point) {
    // See http://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    let val = (line1p2.lon - line1p1.lon) * (point.lat - line1p2.lat) -
    (line1p2.lat - line1p1.lat) * (point.lon - line1p2.lon);
    if (val === 0) {
        return 0;
    }  // colinear
    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

/**
 * The main function that returns true if line segment 'p1q1'
 * and 'p2q2' intersect.
 *
 * @param    {object} inputLine1p1  Line 1 point 1.
 * @property {object} lat           Latitude for point.
 * @property {object} lon           Longitude for point.
 * @param    {object} inputLine1p2  Line 1 point 2.
 * @property {object} lat           Latitude for point.
 * @property {object} lon           Longitude for point.
 * @param    {object} inputLine2p1  Line 2 point 1.
 * @property {object} lat           Latitude for point.
 * @property {object} lon           Longitude for point.
 * @param    {object} inputLine2p2  Line 2 point 2.
 * @property {object} lat           Latitude for point.
 * @property {object} lon           Longitude for point.
 *
 * @example
 * let geo = require(appPath + 'lib/geo-lib');
 * let result = geo.linesIntersect(
 *     {lat: 59.75639, lon: 6.67968}, {lat: 61.15383, lon: 11.87622},
 *     {lat: 61.51745, lon: 8.15185}, {lat: 59.75086, lon: 11.1621}
 * );
 *
 * @returns {boolean} isInside - True or false.
 */
GeoLib.prototype.linesIntersect = function linesIntersect(inputLine1p1, inputLine1p2, inputLine2p1, inputLine2p2) {
    let line1p1, line1p2,
        line2p1, line2p2;
    if (Array.isArray(inputLine1p1)) {
        line1p1 = { lat: inputLine1p1[0], lon: inputLine1p1[1] };
    } else {
        line1p1 = {
            lat: (typeof inputLine1p1.lat === 'undefined' ? inputLine1p1.y : inputLine1p1.lat),
            lon: (typeof inputLine1p1.lon === 'undefined' ? inputLine1p1.x : inputLine1p1.lon)
        };
    }
    if (Array.isArray(inputLine1p2)) {
        line1p2 = { lat: inputLine1p2[0], lon: inputLine1p2[1] };
    } else {
        line1p2 = {
            lat: (typeof inputLine1p2.lat === 'undefined' ? inputLine1p2.y : inputLine1p2.lat),
            lon: (typeof inputLine1p2.lon === 'undefined' ? inputLine1p2.x : inputLine1p2.lon)
        };
    }
    if (Array.isArray(inputLine2p1)) {
        line2p1 = { lat: inputLine2p1[0], lon: inputLine2p1[1] };
    } else {
        line2p1 = {
            lat: (typeof inputLine2p1.lat === 'undefined' ? inputLine2p1.y : inputLine2p1.lat),
            lon: (typeof inputLine2p1.lon === 'undefined' ? inputLine2p1.x : inputLine2p1.lon)
        };
    }
    if (Array.isArray(inputLine2p2)) {
        line2p2 = { lat: inputLine2p2[0], lon: inputLine2p2[1] };
    } else {
        line2p2 = {
            lat: (typeof inputLine2p2.lat === 'undefined' ? inputLine2p2.y : inputLine2p2.lat),
            lon: (typeof inputLine2p2.lon === 'undefined' ? inputLine2p2.x : inputLine2p2.lon)
        };
    }
    // --------------------------------------------------------------------------------
    // Start the magic.
    // Find the four orientations needed for general and
    // special cases
    let o1 = findPointOrientation(line1p1, line1p2, line2p1);
    let o2 = findPointOrientation(line1p1, line1p2, line2p2);
    let o3 = findPointOrientation(line2p1, line2p2, line1p1);
    let o4 = findPointOrientation(line2p1, line2p2, line1p2);
    // General case
    if (o1 !== o2 && o3 !== o4) { return true; }
    // Special Cases
    // line1p1, line1p2 and line2p1 are colinear and line2p1 lies on segment p1q1
    if (o1 === 0 && isPointOnLineSegment(line1p1, line2p1, line1p2)) { return true; }
    // line1p1, line1p2 and line2p1 are colinear and line2p2 lies on segment p1q1
    if (o2 === 0 && isPointOnLineSegment(line1p1, line2p2, line1p2)) { return true; }
    // line2p1, line2p2 and line1p1 are colinear and line1p1 lies on segment p2q2
    if (o3 === 0 && isPointOnLineSegment(line2p1, line1p1, line2p2)) { return true; }
    // line2p1, line2p2 and line1p2 are colinear and line1p2 lies on segment p2q2
    if (o4 === 0 && isPointOnLineSegment(line2p1, line1p2, line2p2)) { return true; }
    // Doesn't fall in any of the above cases
    return false;
};

function checkIfPolygonpointIsInsideOtherPolygon(polygonA, polygonB) {
    let i;
    for (i = 0; i < polygonA.length; i++) {
        if (GeoLib.prototype.pointInsidePolygon(polygonA[i], polygonB)) {
            return true;
        }
    }
    for (i = 0; i < polygonB.length; i++) {
        if (GeoLib.prototype.pointInsidePolygon(polygonB[i], polygonA)) {
            return true;
        }
    }
    return false;
}

function checkIfPolygonEdgesOverlaps(polygonA, polygonB) {
    for (var i = 0; i < polygonA.length - 1; i++) {
        for (var j = 0; j < polygonB.length - 1; j++) {
            if (GeoLib.prototype.linesIntersect(
                    {lat: polygonA[i].lat, lon: polygonA[i].lon}, {lat: polygonA[i + 1].lat, lon: polygonA[i + 1].lon},
                    {lat: polygonB[j].lat, lon: polygonB[j].lon}, {lat: polygonB[j + 1].lat, lon: polygonB[j + 1].lon}
                )) {
                return true;
            }
        }
    }
    return false;
}

/**
 * @param    {array}  inputPolygonA Input polygon A.
 * @property {object} x             Latitude for start point.
 * @property {object} y             Longitude for destination point.
 * @param    {array}  inputPolygonB Input polygon B.
 * @property {object} x             Latitude for start point.
 * @property {object} y             Longitude for destination point.
 *
 * @example
 * let geo = require(appPath + 'lib/geo-lib');
 * let result = geo.polygonOverlapsPolygon(
 *     [
 *         {lat:1, lon:1}, {lat:1, lon:4},
 *         {lat:8, lon:4}, {lat:8, lon:1}
 *     ],
 *     [
 *         {lat:3, lon:0}, {lat:3, lon:6},
 *         {lat:7, lon:6}, {lat:7, lon:0}
 *     ]
 * );
 *
 * @returns {boolean} polygonOverlapsPolygon - True or false.
 */
GeoLib.prototype.polygonOverlapsPolygon = function polygonOverlapsPolygon(inputPolygonA, inputPolygonB) {
    let polygonA = [],
        polygonB = [];
    // Check if we have an array of arrays as input. If so make it an
    // array of objects.
    // inputPolygonA
    if (Array.isArray(inputPolygonA) && typeof inputPolygonA[0] === 'number') {
        for (let i = 0; i < inputPolygonA.length; i += 2) {
            let p = {
                lat: inputPolygonA[i],
                lon: inputPolygonA[i + 1]
            };
            polygonA.push(p);
        }
    } else if (Array.isArray(inputPolygonA) && Array.isArray(inputPolygonA[0])) {
        for (let i = 0; i < inputPolygonA.length; i++) {
            let p = {
                lat: inputPolygonA[i][0],
                lon: inputPolygonA[i][1]
            };
            polygonA.push(p);
        }
    } else {
        for (let i = 0; i < inputPolygonA.length; i++) {
            polygonA.push({
                lat: (typeof inputPolygonA[i].lat === 'undefined' ? inputPolygonA[i].y : inputPolygonA[i].lat),
                lon: (typeof inputPolygonA[i].lon === 'undefined' ? inputPolygonA[i].x : inputPolygonA[i].lon)
            });
        }
    }
    // inputPolygonB
    if (Array.isArray(inputPolygonB) && typeof inputPolygonB[0] === 'number') {
        for (let i = 0; i < inputPolygonB.length; i += 2) {
            let p = {
                lat: inputPolygonB[i],
                lon: inputPolygonB[i + 1]
            };
            polygonB.push(p);
        }
    } else if (Array.isArray(inputPolygonB) && Array.isArray(inputPolygonB[0])) {
        for (let i = 0; i < inputPolygonB.length; i++) {
            let p = {
                lat: inputPolygonB[i][0],
                lon: inputPolygonB[i][1]
            };
            polygonB.push(p);
        }
    } else {
        for (let i = 0; i < inputPolygonB.length; i++) {
            polygonB.push({
                lat: (typeof inputPolygonB[i].lat === 'undefined' ? inputPolygonB[i].y : inputPolygonB[i].lat),
                lon: (typeof inputPolygonB[i].lon === 'undefined' ? inputPolygonB[i].x : inputPolygonB[i].lon)
            });
        }
    }
    // --------------------------------------------------------------------------------
    // Start the magic.
    if (checkIfPolygonpointIsInsideOtherPolygon(polygonA, polygonB)) {
        return true;
    }
    if (checkIfPolygonEdgesOverlaps(polygonA, polygonB)) {
        return true;
    }
    return false;
};

module.exports = new GeoLib();
