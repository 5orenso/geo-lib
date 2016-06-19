/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Vincenty Direct and Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2016  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/latlong-vincenty.html                                           */
/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-vincenty.html                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

/*
 * Ellipsoid parameters; semi-major axis (a), semi-minor axis (b), and flattening (f) for each ellipsoid.
 * Flattening f = (a−b)/a; at least one of these parameters is derived from defining constants.
 */
const ellipsoids = {
    WGS84:        { a: 6378137,     b: 6356752.314245, f: 1 / 298.257223563 },
    GRS80:        { a: 6378137,     b: 6356752.314140, f: 1 / 298.257222101 },
    Airy1830:     { a: 6377563.396, b: 6356256.909,    f: 1 / 299.3249646   },
    AiryModified: { a: 6377340.189, b: 6356034.448,    f: 1 / 299.3249646   },
    Bessel1841:   { a: 6377397.155, b: 6356078.962818, f: 1 / 299.1528128   },
    Clarke1866:   { a: 6378206.4,   b: 6356583.8,      f: 1 / 294.978698214 },
    Intl1924:     { a: 6378388,     b: 6356911.946,    f: 1 / 297           }, // aka Hayford
    WGS72:        { a: 6378135,     b: 6356750.5,      f: 1 / 298.26        }
};

const datums = {
    /* eslint key-spacing: 0, comma-dangle: 0 */
    WGS84: {
        ellipsoid: ellipsoids.WGS84,
        transform: {
            tx:    0.0,    ty:    0.0,     tz:    0.0,    // m
            rx:    0.0,    ry:    0.0,     rz:    0.0,    // sec
            s:     0.0 }                                  // ppm
    },
    NAD83: { // (2009); functionally ≡ WGS84 - www.uvm.edu/giv/resources/WGS84_NAD83.pdf
        ellipsoid: ellipsoids.GRS80,
        transform: {
            tx:    1.004,  ty:   -1.910,   tz:   -0.515,  // m
            rx:    0.0267, ry:    0.00034, rz:    0.011,  // sec
            s:    -0.0015 }                               // ppm
    }, // note: if you *really* need to convert WGS84<->NAD83, you need more knowledge than this!
    OSGB36: { // www.ordnancesurvey.co.uk/docs/support/guide-coordinate-systems-great-britain.pdf
        ellipsoid: ellipsoids.Airy1830,
        transform: {
            tx: -446.448,  ty:  125.157,   tz: -542.060,  // m
            rx:   -0.1502, ry:   -0.2470,  rz:   -0.8421, // sec
            s:    20.4894 }                               // ppm
    },
    ED50: { // og.decc.gov.uk/en/olgs/cms/pons_and_cop/pons/pon4/pon4.aspx
        ellipsoid: ellipsoids.Intl1924,
        transform: {
            tx:   89.5,    ty:   93.8,     tz:  123.1,    // m
            rx:    0.0,    ry:    0.0,     rz:    0.156,  // sec
            s:    -1.2 }                                  // ppm
    },
    Irl1975: { // osi.ie/OSI/media/OSI/Content/Publications/transformations_booklet.pdf
        ellipsoid: ellipsoids.AiryModified,
        transform: {
            tx: -482.530,  ty:  130.596,   tz: -564.557,  // m
            rx:   -1.042,  ry:   -0.214,   rz:   -0.631,  // sec
            s:    -8.150 }                                // ppm
    }, // TODO: many sources have opposite sign to rotations - to be checked!
    TokyoJapan: { // www.geocachingtoolbox.com?page=datumEllipsoidDetails
        ellipsoid: ellipsoids.Bessel1841,
        transform: {
            tx:  148,      ty: -507,       tz: -685,      // m
            rx:    0,      ry:    0,       rz:    0,      // sec
            s:     0 }                                    // ppm
    },
    NAD27: { // en.wikipedia.org/wiki/Helmert_transformation
        ellipsoid: ellipsoids.Clarke1866,
        transform: {
            tx:    8,      ty: -160,       tz: -176,      // m
            rx:    0,      ry:    0,       rz:    0,      // sec
            s:     0 }                                    // ppm
    },
    WGS72: { // www.icao.int/safety/pbn/documentation/eurocontrol/eurocontrol wgs 84 implementation manual.pdf
        ellipsoid: ellipsoids.WGS72,
        transform: {
            tx:    0,      ty:    0,       tz:   -4.5,    // m
            rx:    0,      ry:    0,       rz:    0.554,  // sec
            s:    -0.22 }                                 // ppm
    }
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function toDegrees(radians) {
    return radians * 180 / Math.PI;
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * Direct and inverse solutions of geodesics on the ellipsoid using Vincenty formulae.
 *
 * From: T Vincenty, "Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of
 *       nested equations", Survey Review, vol XXIII no 176, 1975.
 *       www.ngs.noaa.gov/PUBS_LIB/inverse.pdf.
 *
 * @constructor
 */
function GeoVincenty(height, datum) {
    this.height = Number(height);
    this.datum = datum ? datum : datums.WGS84;
}

/**
 * Returns the distance between ‘this’ point and destination point along a geodesic, using Vincenty
 * inverse solution.
 *
 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
 * ignored).
 *
 * @param   {object} p1 - Latitude/longitude of start point.
 * @param   {object} p2 - Latitude/longitude of destination point.
 * @returns (Number} Distance in metres between points or NaN if failed to converge.
 *
 * @example
 * let geo = require('lib/geo-vincenty');
 * let result = geo.distance(
 *     { lat: 70.3369224, lon: 30.3411273 },
 *     { lat: 59.8939528, lon: 10.6450348 }
 * ); // 1472858.99 m
 *
 */
GeoVincenty.prototype.distance = function(p1, p2) {
    if (typeof p1 !== 'object') {
        throw new TypeError('p1 is not object');
    } else if (typeof p2 !== 'object') {
        throw new TypeError('p2 is not object');
    }
    return this.inverse(p1, p2).distance;
};

/**
 * Returns the initial bearing (forward azimuth) to travel along a geodesic from ‘this’ point to the
 * specified point, using Vincenty inverse solution.
 *
 * Note: the datum used is of ‘this’ point.
 *
 * @param   {object} p1 - Latitude/longitude of start point.
 * @param   {object} p2 - Latitude/longitude of destination point.
 * @returns {number}  initial Bearing in degrees from north (0°..360°) or NaN if failed to converge.
 *
 * @example
 * let geo = require('lib/geo-vincenty');
 * let result = geo.initialBearing(
 *     { lat: 70.3369224, lon: 30.3411273 },
 *     { lat: 59.8939528, lon: 10.6450348 }
 * ); // 227.7704951964118°
 *
 */
GeoVincenty.prototype.initialBearing = function(p1, p2) {
    if (typeof p1 !== 'object') {
        throw new TypeError('p1 is not object');
    } else if (typeof p2 !== 'object') {
        throw new TypeError('p2 is not object');
    }
    return this.inverse(p1, p2).initialBearing;
};

/**
 * Returns the final bearing (reverse azimuth) having travelled along a geodesic from ‘this’ point
 * to the specified point, using Vincenty inverse solution.
 *
 * Note: the datum used is of ‘this’ point.
 *
 * @param   {object} p1 - Latitude/longitude of start point.
 * @param   {object} p2 - Latitude/longitude of destination point.
 * @returns {number}  Initial bearing in degrees from north (0°..360°) or NaN if failed to converge.
 *
 * @example
 * let geo = require('lib/geo-vincenty');
 * let result = geo.finalBearing(
 *     { lat: 70.3369224, lon: 30.3411273 },
 *     { lat: 59.8939528, lon: 10.6450348 }
 * ); // 209.79851310389347°
 *
 */
GeoVincenty.prototype.finalBearing = function(p1, p2) {
    if (typeof p1 !== 'object') {
        throw new TypeError('p1 is not object');
    } else if (typeof p2 !== 'object') {
        throw new TypeError('p2 is not object');
    }
    return this.inverse(p1, p2).finalBearing;
};

/**
 * Returns the destination point having travelled the given distance along a geodesic given by
 * initial bearing from ‘this’ point, using Vincenty direct solution.
 *
 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
 * ignored).
 *
 * @param   {object} p1 - Latitude/longitude of start point.
 * @param   {number} distance - Distance travelled along the geodesic in metres.
 * @param   {number} initialBearing - Initial bearing in degrees from north.
 * @returns {GeoVincenty} Destination point.
 *
 * @example
 * let geo = require('lib/geo-vincenty');
 * let result = geo.destinationPoint(
 *     { lat: 70.3369224, lon: 30.3411273 },
 *     1000, 360
 * ); // { lat: 70.46020285321445, lon: 31.104957300000027 }
 *
 */
GeoVincenty.prototype.destinationPoint = function(p1, distance, initialBearing) {
    if (typeof p1 !== 'object' || typeof p1.lat !== 'number' || typeof p1.lon !== 'number') {
        throw new TypeError('p1 is not object or is in wrong format. Input JSON: ', JSON.stringify(p1));
    } else if (typeof distance !== 'number') {
        throw new TypeError('distance is not a number');
    } else if (typeof initialBearing !== 'number') {
        throw new TypeError('initialBearing is not a number');
    }
    return this.direct(p1, Number(distance), Number(initialBearing)).point;
};

/**
 * Returns the final bearing (reverse azimuth) having travelled along a geodesic given by initial
 * bearing for a given distance from ‘this’ point, using Vincenty direct solution.
 *
 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
 * ignored).
 *
 * @param   {object} p1 - Latitude/longitude of start point.
 * @param   {number} distance - Distance travelled along the geodesic in metres.
 * @param   {GeoVincenty} initialBearing - Initial bearing in degrees from north.
 * @returns {number} Final bearing in degrees from north (0°..360°).
 *
 * @example
 *   var p1 = new GeoVincenty(-37.95103, 144.42487);
 *   var b2 = p1.finalBearingOn(306.86816, 54972.271); // 307.1736°
 */
GeoVincenty.prototype.finalBearingOn = function(p1, distance, initialBearing) {
    if (typeof p1 !== 'object' || typeof p1.lat !== 'number' || typeof p1.lon !== 'number') {
        throw new TypeError('p1 is not object or is in wrong format. Input JSON: ', JSON.stringify(p1));
    } else if (typeof distance !== 'number') {
        throw new TypeError('distance is not a number');
    } else if (typeof initialBearing !== 'number') {
        throw new TypeError('initialBearing is not a number');
    }
    return this.direct(p1, Number(distance), Number(initialBearing)).finalBearing;
};

/**
 * Vincenty direct calculation.
 *
 * @private
 * @param   {object} p1 - Latitude/longitude of start point.
 * @param   {number} distance - Distance along bearing in metres.
 * @param   {number} initialBearing - Initial bearing in degrees from north.
 * @returns (Object} Object including point (destination point), finalBearing.
 * @throws  {Error}  If formula failed to converge.
 */
GeoVincenty.prototype.direct = function(p1, distance, initialBearing) {
    var φ1 = toRadians(p1.lat),
        λ1 = toRadians(p1.lon);
    var α1 = toRadians(initialBearing);
    var s = distance;

    var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

    var sinα1 = Math.sin(α1);
    var cosα1 = Math.cos(α1);

    var tanU1 = (1 - f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
    var σ1 = Math.atan2(tanU1, cosα1);
    var sinα = cosU1 * sinα1;
    var cosSqα = 1 - sinα * sinα;
    var uSq = cosSqα * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

    var cos2σM, sinσ, cosσ, Δσ;

    var σ = s / (b * A), σʹ, iterations = 0;
    do {
        cos2σM = Math.cos(2 * σ1 + σ);
        sinσ = Math.sin(σ);
        cosσ = Math.cos(σ);
        Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
            B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));
        σʹ = σ;
        σ = s / (b * A) + Δσ;
    } while (Math.abs(σ - σʹ) > 1e-12 && ++iterations < 200);
    if (iterations >= 200) {
        throw new Error('Formula failed to converge');
    } // not possible?

    var x = sinU1 * sinσ - cosU1 * cosσ * cosα1;
    var φ2 = Math.atan2(sinU1 * cosσ + cosU1 * sinσ * cosα1, (1 - f) * Math.sqrt(sinα * sinα + x * x));
    var λ = Math.atan2(sinσ * sinα1, cosU1 * cosσ - sinU1 * sinσ * cosα1);
    var C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
    var L = λ - (1 - C) * f * sinα *
        (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
    var λ2 = (λ1 + L + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // normalise to -180.. + 180

    var α2 = Math.atan2(sinα, -x);
    α2 = (α2 + 2 * Math.PI) % (2 * Math.PI); // normalise to 0..360

    return {
        point: {lat: toDegrees(φ2), lon: toDegrees(λ2)},
        finalBearing: toDegrees(α2)
    };
};

/**
 * Vincenty inverse calculation.
 *
 * @private
 * @param   {object} p1 - Latitude/longitude of start point.
 * @param   {object} p2 - Latitude/longitude of destination point.
 * @returns {Object} Object including distance, initialBearing, finalBearing.
 * @throws  {Error}  If formula failed to converge.
 */
GeoVincenty.prototype.inverse = function(p1, p2) {
    var φ1 = toRadians(p1.lat), λ1 = toRadians(p1.lon);
    var φ2 = toRadians(p2.lat), λ2 = toRadians(p2.lon);

    var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

    var L = λ2 - λ1;
    var tanU1 = (1 - f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
    var tanU2 = (1 - f) * Math.tan(φ2), cosU2 = 1 / Math.sqrt((1 + tanU2 * tanU2)), sinU2 = tanU2 * cosU2;

    var sinλ, cosλ, sinSqσ, sinσ, cosσ, σ, sinα, cosSqα, cos2σM, C;

    var λ = L, λʹ, iterations = 0;
    do {
        sinλ = Math.sin(λ);
        cosλ = Math.cos(λ);
        sinSqσ = (cosU2 * sinλ) * (cosU2 * sinλ) +
            (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
        sinσ = Math.sqrt(sinSqσ);
        if (sinσ === 0) {
            return 0;
        }  // co-incident points
        cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
        σ = Math.atan2(sinσ, cosσ);
        sinα = cosU1 * cosU2 * sinλ / sinσ;
        cosSqα = 1 - sinα * sinα;
        cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα;
        if (isNaN(cos2σM)) {
            cos2σM = 0;
        }  // equatorial line: cosSqα=0 (§6)
        C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
        λʹ = λ;
        λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
    } while (Math.abs(λ - λʹ) > 1e-12 && ++iterations < 200);
    if (iterations >= 200) {
        throw new Error('Formula failed to converge');
    }
    var uSq = cosSqα * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    var Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
        B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));

    var s = b * A * (σ - Δσ);

    var α1 = Math.atan2(cosU2 * sinλ,  cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
    var α2 = Math.atan2(cosU1 * sinλ, -sinU1 * cosU2 + cosU1 * sinU2 * cosλ);

    α1 = (α1 + 2 * Math.PI) % (2 * Math.PI); // normalise to 0..360
    α2 = (α2 + 2 * Math.PI) % (2 * Math.PI); // normalise to 0..360

    s = Number(s.toFixed(3)); // round to 1mm precision
    return { distance: s, initialBearing: toDegrees(α1), finalBearing: toDegrees(α2) };
};

module.exports = new GeoVincenty(); // ≡ export default GeoVincenty
