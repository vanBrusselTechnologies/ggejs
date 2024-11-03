const {execute: abl} = require("./abl");
const {execute: searchAllianceById} = require("../../commands/searchAllianceById");

module.exports.name = "aug";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{STO: Object, ABL:Object}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const cud = socket.client.clientUserData;
    cud.myAlliance.parseStorage(params.STO);
    abl(socket, errorCode, params.ABL);
    searchAllianceById(socket, cud.allianceId);
}