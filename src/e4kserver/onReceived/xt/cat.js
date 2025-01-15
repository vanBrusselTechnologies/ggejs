const {execute: gam} = require('./gam');
const {execute: gcu} = require('./gcu');

module.exports.name = "cat";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode === 197 || errorCode === 199) return;
    gam(socket, 0, {M: [params.A]});
    gcu(socket, 0, params.gcu);
}