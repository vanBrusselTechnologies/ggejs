const {execute: gam} = require('./gam');

module.exports.name = "csm";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    // TODO: errorCode: 95?
    if (!params) return;
    gam(client, 0, {M: [params.A]});
}