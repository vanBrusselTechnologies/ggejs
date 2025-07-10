const MyAlliance = require("../structures/MyAlliance");
const Alliance = require('../structures/Alliance');
const {execute: abl} = require('./onReceived/abl');

const NAME = "ain"
/** @type {CommandCallback<Alliance>[]}*/
const callbacks = []

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const alliance = parseAIN(client, params);
    require('.').baseExecuteCommand(alliance, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number} allianceId
 * @return {Promise<Alliance>}
 */
module.exports.getAllianceInfo = function (client, allianceId) {
    const C2SGetAllianceInfoVO = {AID: allianceId};
    return require('.').baseSendCommand(client, NAME, C2SGetAllianceInfoVO, callbacks, (p) => p?.A?.AID === allianceId);
}

module.exports.ain = parseAIN;

/**
 * @param {Client} client
 * @param {{A: Object}} params
 * @returns {Alliance}
 */
function parseAIN(client, params) {
    if (params?.A?.AID === undefined) return null;
    const cud = client.clientUserData;
    const alliance = (params.A.AID === cud.allianceId) ? new MyAlliance(client, params.A) : new Alliance(client, params.A);
    if (alliance.allianceId === cud.allianceId) {
        // TODO: only reset the values, not overwriting whole myAlliance object
        cud.myAlliance = alliance;

        /** @type {AllianceMember} */
        const member = alliance.memberList.find(m => m.playerId === cud.playerId);
        if (member) cud.allianceRank = member.allianceRank;

        const allianceLeader = alliance.memberList.find(m => m.allianceRank === 0);
        if (alliance.languageId === "" && allianceLeader.playerId === cud.playerId /*todo: && featureRestrictionsModel.isFeatureEnabled("allianceEditLanguage")*/) {
            // TODO: sendJsonSignal.dispatch(new SendJsonMessageVO(new C2SChangeAllianceLanguageVO(Localization.language)));
        }
        if (params.A["abl"]) abl(client, 0, params.A["abl"]);
    }
    return alliance;
}