const {execute: allianceHelpAll} = require("../commands/allianceHelpAll");

module.exports.name = "ahh";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{LID:number, AC:number, PN:string, P:number, PID: number, TID: number, OP: Object, RT: number, TSL: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;

    /* todo:
        const listId = params.LID;
        let allianceHelpRequest = allianceHelpData.getRequestVOByListID(listId);
        if (allianceHelpRequest) {
            parseAllianceHelpRequest(client, allianceHelpRequest, params);
        } else {
            allianceHelpRequest = new AllianceHelpRequest();
            parseAllianceHelpRequest(client, allianceHelpRequest, params);
            allianceHelpData.allianceHelpRequests.push(allianceHelpRequest);
        }
     */

    //todo: REMOVE below because not part of source code
    // TODO: re-enable if (params["AC"] === 0) allianceHelpAll(client);
}

//todo: Move to seperate parser file
/**
 * @param {Client} client
 * @param {AllianceHelpRequest} allianceHelpRequest
 * @param {{AC: number, LID:number, PN:string, P:number, PID: number, TID: number, OP: Object, RT: number, TSL: number}} helpRequest
 */
function parseAllianceHelpRequest(client, allianceHelpRequest, helpRequest) {
    const playerId = client.clientUserData.playerId;
    allianceHelpRequest.alreadyConfirmed = helpRequest["AC"];
    allianceHelpRequest.listID = helpRequest["LID"];
    allianceHelpRequest.playerName = helpRequest["PN"];
    allianceHelpRequest.progress = helpRequest["P"];
    allianceHelpRequest.playerId = helpRequest["PID"];
    allianceHelpRequest.requestTypeId = helpRequest["TID"];
    allianceHelpRequest.optionalParams = helpRequest["OP"];
    allianceHelpRequest.neededProgress = getNeededProgress(allianceHelpRequest.requestTypeId);
    allianceHelpRequest.isOwnPlayer = allianceHelpRequest.playerId === playerId;
    allianceHelpRequest.expirationTime = helpRequest["RT"] === -1 ? -1 : getTimer() + helpRequest["RT"] * 1000;
    allianceHelpRequest.timeSinceLastHelp = getTimer() + helpRequest["TSL"] * 1000;
}
module.exports.parseAllianceHelpRequest = parseAllianceHelpRequest

/**
 * @param {number} requestTypeId
 * @return {number}
 */
function getNeededProgress(requestTypeId) {
    let i = 0;
    const allianceHelpTypes = allianceHelpData.allianceHelpTypeVOs;
    while (i < allianceHelpTypes.length) {
        if (allianceHelpTypes[i].allianceHelpRequestID === requestTypeId) {
            return allianceHelpTypes[i].maxHelpersCount;
        }
        i++;
    }
    return -1;
}