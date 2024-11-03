const {execute: collectTownsfolkGoods} = require('../../commands/collectTownsfolkGoods');

module.exports.name = "irc";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    let collectWaitTime = Math.random() * 1000;
    if (errorCode === 0 && params && params.G?.length > 0) {
        setTimeout(function () {
            collectTownsfolkGoods(socket);
        }, collectWaitTime);
    }
}