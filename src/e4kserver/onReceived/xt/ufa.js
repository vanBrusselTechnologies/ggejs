const {TitleType} = require("../../../utils/Constants");

module.exports.name = "ufa";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const cud = socket.client.clientUserData;
    cud.setTitlePoints(params["CF"], TitleType.FAME)
    cud.setHighestTitlePoints(params["HF"], TitleType.FAME)
}