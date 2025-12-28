const General = require("../../structures/General");

module.exports.name = "gie";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{G:[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.equipments._setGenerals(params.G.map(g => new General(client, g)));
}