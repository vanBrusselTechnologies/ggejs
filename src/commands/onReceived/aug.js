const {execute: abl} = require("./abl");
const {getAllianceInfo} = require("../ain");

module.exports.name = "aug";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{STO: Object, ABL:Object}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const cud = client.clientUserData;
    cud.myAlliance.parseStorage(params.STO);
    abl(client, errorCode, params.ABL);
    getAllianceInfo(client, cud.allianceId).then();
}