const {execute: startTax} = require('../../commands/startTax');

module.exports.name = "txc";
/**
 * @param {Socket} socket
 * @param {number} _
 * @param {Object} __
 */
module.exports.execute = function (socket, _, __) {
    startTax(socket, 0);
}