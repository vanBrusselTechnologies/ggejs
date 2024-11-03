const {TitleType} = require("../../../utils/Constants");

module.exports.name = "ufp";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const cud = socket.client.clientUserData;
    cud.setTitlePoints(params["CFP"], TitleType.FACTION)
    cud.setHighestTitlePoints(params["HFP"], TitleType.FACTION)
}