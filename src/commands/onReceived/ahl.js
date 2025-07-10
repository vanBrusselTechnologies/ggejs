const {execute: allianceHelpAll} = require("../commands/allianceHelpAll");

module.exports.name = "ahl";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{AHL: {AC: number, LID:number, PN:string, P:number, PID: number, TID: number, OP: Object, RT: number, TSL: number}[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    /* todo
        const {parseAllianceHelpRequest} = require("./ahh");
        const allianceHelpList = params.AHL;
        const allianceHelpRequests = [];
        let i = 0;
        while (i < allianceHelpList.length) {
            const allianceHelpRequest = new AllianceHelpRequest();
            parseAllianceHelpRequest(client, allianceHelpRequest, allianceHelpList[i]);
            allianceHelpRequests.push(allianceHelpRequest);
            i++;
        }
        allianceHelpData.allianceHelpRequests = allianceHelpRequests;
     */

    // TODO: REMOVE below because not part of source code
    let _allianceHelpRequestList = params.AHL;
    if (_allianceHelpRequestList.length === 0) return;
    for (let i in _allianceHelpRequestList) {
        let helpRequest = _allianceHelpRequestList[i];
        if (helpRequest.AC === 0 && helpRequest.PID !== client.clientUserData.playerId) {
            // TODO: re-enable allianceHelpAll(client);
            return;
        }
    }
}