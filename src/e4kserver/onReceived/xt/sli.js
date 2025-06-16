const {execute: collectStartupLoginBonus} = require('../../commands/collectStartupLoginBonus')

module.exports.name = "sli";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{NRR: number, CC: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    if (params.CC === 1) collectStartupLoginBonus(client)
}