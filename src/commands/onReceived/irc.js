const {execute: collectTownsfolkGoods} = require('../commands/collectTownsfolkGoods');

module.exports.name = "irc";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode !== 0 || !params || params.G?.length <= 0) return;
    setTimeout(function () {
        collectTownsfolkGoods(client);
    }, Math.random() * 1000);
}