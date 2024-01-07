const MyAlliance = require("./../../../structures/MyAlliance");
const Alliance = require('./../../../structures/Alliance');

module.exports.name = "ain";

/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{A:Object}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode === 114 || !params || !params.A) return;
    let alliance = (params.A.A !== null && params.A.A !== undefined) ? new MyAlliance(socket.client, params.A) : new Alliance(socket.client, params.A);
    const cud = socket.client.clientUserData;
    if (alliance.allianceId === cud.allianceId) {
        /** @type {AllianceMember} */
        const member = alliance.memberList.find(m => m.playerId === cud.playerId)
        if (member) {
            cud.allianceRank = member.allianceRank;
        }
    }
    socket[`_alliance_${alliance.allianceId}_data`] = alliance;
}