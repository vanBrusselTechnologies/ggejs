const MyAlliance = require("../../../structures/MyAlliance");
const Alliance = require('../../../structures/Alliance');
const {execute: abl} = require('./abl');

module.exports.name = "ain";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{A:Object}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode === 114 || !params || !params.A) return;
    const cud = socket.client.clientUserData;
    let alliance = (params.A.AID === cud.allianceId) ? new MyAlliance(socket.client, params.A) : new Alliance(socket.client, params.A);
    if (alliance.allianceId === cud.allianceId) {
        // TODO: only reset the values, not overwriting whole myAlliance object
        cud.myAlliance = alliance;

        /** @type {AllianceMember} */
        const member = alliance.memberList.find(m => m.playerId === cud.playerId)
        if (member) cud.allianceRank = member.allianceRank;

        const allianceLeader = alliance.memberList.find(m => m.allianceRank === 0)
        if (alliance.languageId === "" && allianceLeader.playerId === cud.playerId /*todo: && featureRestrictionsModel.isFeatureEnabled("allianceEditLanguage")*/) {
            //todo: sendJsonSignal.dispatch(new SendJsonMessageVO(new C2SChangeAllianceLanguageVO(Localization.language)));
        }
        abl(socket, errorCode, params.A)
    }
    socket[`_alliance_${alliance.allianceId}_data`] = alliance;
}