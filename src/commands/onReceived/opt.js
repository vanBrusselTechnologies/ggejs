module.exports.name = "opt";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{SVF: number, OFF:number, CC2T:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.showVIPFlagOption = params.SVF === 1
    /*
     vipFlagChangedSignal.dispatch();
     rubyPayConfirmData.rubyLimit = paramObj["CC2T"];
     */
}