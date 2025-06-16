const {execute: gam} = require("./gam");
const {execute: gcu} = require("./gcu");

module.exports.name = "cds";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params || errorCode === 197 || errorCode === 199 || errorCode === 91 || errorCode === 101 || errorCode === 218) return;
    gam(client, 0, {M: [params.A]});
    gcu(client, 0, params.gcu);
}