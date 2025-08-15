const {ain} = require('../ain');
const {execute: gcu} = require('./gcu');
const {execute: grc} = require('./grc');

module.exports.name = "ado";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{gcu:{C1: number, C2: number}, grc: Object, ain: Object}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    ain(client, params.ain);
    gcu(client, errorCode, params.gcu);
    grc(client, errorCode, params.grc);
}