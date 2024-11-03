const {execute: gam} = require('./gam');

module.exports.name = "csm";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    //todo: errorCode: 95?
    if (!params) return;
    gam(socket, 0, {M: [params.A]});
}