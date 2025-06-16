const MyAlliance = require("../../structures/MyAlliance");
const Alliance = require('../../structures/Alliance');
const {execute: abl} = require('./abl');

module.exports.name = "ain";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{A:Object}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode === 114 || !params || !params.A) return;
    const cud = client.clientUserData;
    let alliance = (params.A.AID === cud.allianceId) ? new MyAlliance(client, params.A) : new Alliance(client, params.A);
    if (alliance.allianceId === cud.allianceId) {
        // TODO: only reset the values, not overwriting whole myAlliance object
        cud.myAlliance = alliance;

        /** @type {AllianceMember} */
        const member = alliance.memberList.find(m => m.playerId === cud.playerId);
        if (member) cud.allianceRank = member.allianceRank;

        const allianceLeader = alliance.memberList.find(m => m.allianceRank === 0);
        if (alliance.languageId === "" && allianceLeader.playerId === cud.playerId /*todo: && featureRestrictionsModel.isFeatureEnabled("allianceEditLanguage")*/) {
            //todo: sendJsonSignal.dispatch(new SendJsonMessageVO(new C2SChangeAllianceLanguageVO(Localization.language)));
        }
        if (params.A["abl"]) abl(client, errorCode, params.A["abl"]);
    }
    client._socket[`_alliance_${alliance.allianceId}_data`] = alliance;
}