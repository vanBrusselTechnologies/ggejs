const {TitleType} = require("../../../utils/Constants");

module.exports.name = "ufa";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const cud = client.clientUserData;
    cud.setTitlePoints(params["CF"], TitleType.FAME)
    cud.setHighestTitlePoints(params["HF"], TitleType.FAME)
}