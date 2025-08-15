const {execute: gam} = require('./gam');

module.exports.name = "crm";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    gam(client, 0, {M: [params.A]});
}