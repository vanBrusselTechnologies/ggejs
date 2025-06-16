module.exports.name = "acv";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{H:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    //todo: client.clientUserData/*.allianceData*/.miniChatHidden = params.H === 1;
}