const {execute: collectTax} = require('../commands/collectTax');

module.exports.name = "txs";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (client._socket["inTaxTimeout"]) return;
    client._socket["inTaxTimeout"] = true;
    setTimeout(function () {
        client._socket["inTaxTimeout"] = false;
        collectTax(client);
    }, (params.txi.TX.RT + Math.random() * 10) * 1000);
}