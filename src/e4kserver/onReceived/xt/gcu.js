const Good = require("../../../structures/Good");

module.exports.name = "gcu";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{C1: number, C2: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    if (params.C1) client.clientUserData.setGlobalCurrency(new Good(client, ["C1", params.C1]));
    if (params.C2) client.clientUserData.setGlobalCurrency(new Good(client, ["C2", params.C2]));
}