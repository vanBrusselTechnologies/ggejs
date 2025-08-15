const {execute: gam} = require('./gam');
const {execute: gcu} = require('./gcu');

module.exports.name = "cat";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode === 197 || errorCode === 199) return;
    gam(client, 0, {M: [params.A]});
    gcu(client, 0, params.gcu);
}