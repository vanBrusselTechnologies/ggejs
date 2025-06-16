const General = require("../../structures/General");

module.exports.name = "gie";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const generals = [];
    for (let g of params["G"]) {
        generals.push(new General(client, g));
    }
    client.equipments._setGenerals(generals);
}