const {execute: gli} = require('./gli');
const {execute: gcu} = require('./gcu');
const {execute: esl} = require('./esl');

module.exports.name = "seq";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{gli:{},gcu:{C1: number, C2: number},esl:{E: number, TE: number, G: number, TG: number}}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode !== 0) client._socket["seq -> errorCode"] = errorCode;
    if (!params) return;
    client._socket["seq -> sold"] = true;
    if (params?.gli) gli(client, errorCode, params.gli);
    if (params?.gcu) gcu(client, errorCode, params.gcu);
    if (params?.esl) esl(client, errorCode, params.esl);
}