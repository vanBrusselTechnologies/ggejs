const {execute: allianceHelpAllCommand} = require("./../../commands/allianceHelpAllCommand");

module.exports.name = "ahl"
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    let _allianceHelpRequestList = params.AHL
    if (_allianceHelpRequestList.length === 0) return;
    for (let i in _allianceHelpRequestList) {
        let helpRequest = _allianceHelpRequestList[i];
        if (helpRequest.AC === 0 && helpRequest.PID !== socket.client.clientUserData.playerId) {
            allianceHelpAllCommand(socket);
            return;
        }
    }
}