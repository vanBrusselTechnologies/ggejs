const {execute: gam} = require("./gam");

module.exports.name = "mcm";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params || errorCode === 108 || errorCode === 91) return;
    gam(client, 0, {M: [params.A]});
}