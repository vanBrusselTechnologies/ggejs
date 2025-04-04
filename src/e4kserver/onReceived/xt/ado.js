const {execute: ain} = require('./ain');
const {execute: gcu} = require('./gcu');
const {execute: grc} = require('./grc');

module.exports.name = "ado";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{gcu:{C1: number, C2: number}, grc: Object, ain: Object}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    ain(socket, errorCode, params.ain);
    gcu(socket, errorCode, params.gcu);
    grc(socket, errorCode, params.grc);
}