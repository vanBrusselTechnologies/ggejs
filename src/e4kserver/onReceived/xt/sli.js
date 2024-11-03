const {execute: collectStartupLoginBonus} = require('../../commands/collectStartupLoginBonus')

module.exports.name = "sli";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{NRR: number, CC: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    if (params.CC === 1) collectStartupLoginBonus(socket)
}