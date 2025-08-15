const {execute: gam} = require("./gam");
const {execute: gcu} = require("./gcu");

module.exports.name = "css";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    gam(client, 0, {M: [params.A]});
    gcu(client, 0, params.gcu);
}