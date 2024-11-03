const {execute: gli} = require('./gli');
const {execute: gcu} = require('./gcu');
const {execute: esl} = require('./esl');

module.exports.name = "seq";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{gli:{},gcu:{C1: number, C2: number},esl:{E: number, TE: number, G: number, TG: number}}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode !== 0) socket["seq -> errorCode"] = errorCode;
    if (!params) return;
    socket["seq -> sold"] = true;
    if (params?.gli) gli(socket, errorCode, params.gli);
    if (params?.gcu) gcu(socket, errorCode, params.gcu);
    if (params?.esl) esl(socket, errorCode, params.esl);
}