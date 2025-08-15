const Crest = require("../../structures/Crest");

module.exports.name = "gem";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.mayChangeCrest = params["MCE"] === 1;
    client.clientUserData.playerCrest = new Crest(client, params);
}