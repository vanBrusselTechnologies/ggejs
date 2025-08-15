const Good = require("../../structures/Good");

module.exports.name = "sce";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Array<[string, number]>} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    for (const g of params) {
        client.clientUserData.setGlobalCurrency(new Good(g));
    }
}