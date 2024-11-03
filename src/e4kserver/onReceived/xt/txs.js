const {execute: collectTaxCommand} = require('../../commands/collectTax');

module.exports.name = "txs";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (socket["inTaxTimeout"]) return;
    socket["inTaxTimeout"] = true;
    setTimeout(function () {
        socket["inTaxTimeout"] = false;
        collectTaxCommand(socket);
    }, (params.txi.TX.RT + Math.random() * 10) * 1000, socket);
}