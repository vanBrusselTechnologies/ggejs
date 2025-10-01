const {execute: abl} = require("./abl");
const {getAllianceInfo} = require("../ain");
const EmpireError = require("../../tools/EmpireError");

module.exports.name = "aug";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{STO: Object, ABL:Object}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const cud = client.clientUserData;
    cud.myAlliance.parseStorage(params.STO);
    abl(client, errorCode, params.ABL);
    getAllianceInfo(client, cud.allianceId).catch(e => client.logger.w(new EmpireError(e)));
}