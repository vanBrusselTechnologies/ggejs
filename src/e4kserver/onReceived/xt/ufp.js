const {TitleType} = require("../../../utils/Constants");

module.exports.name = "ufp";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const cud = client.clientUserData;
    cud.setTitlePoints(params["CFP"], TitleType.FACTION)
    cud.setHighestTitlePoints(params["HFP"], TitleType.FACTION)
}