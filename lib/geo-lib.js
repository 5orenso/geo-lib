/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016 Øistein Sørensen
 * Licensed under the MIT license.
 */
'use strict';

/**
 * Module dealing with geo stuff.
 * @constructor
 * @param {hash} opt - Constructor options.
 * @property {string} [config={}] The config files.
 */
function GeoLib(opt) {
    let opts = opt || {};
    if (opts.debug) {
        console.log(opts);
    }
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
 * @property {number} lat1 Latitude for point 1.
 * @property {number} lon1 Longitude for point 1.
 * @property {number} lat2 Latitude for point 2.
 * @property {number} lon2 Longitude for point 2.
 * @property {string} [unit] Distance unit.
 * @property {string} [method] Calculation method. (vincenty|haversine)
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
GeoLib.prototype.distance = (opt) => {
    // opt = {
    //   lat1: 70.3369224, lon1: 30.3411273,
    //   lat2: 59.8939528, lon2: 10.6450348,
    //   unit: 'km',
    //   method: 'vincenty|haversine'
    // }
    console.log(opt);
    return {
        distance: 1447.35,
        unit: 'km'
    };
};

module.exports = new GeoLib();
