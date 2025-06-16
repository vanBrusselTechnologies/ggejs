const {execute: startTax} = require('../commands/startTax');

module.exports.name = "txc";
/**
 * @param {Client} client
 * @param {number} _
 * @param {Object} __
 */
module.exports.execute = function (client, _, __) {
    startTax(client, 0);
}