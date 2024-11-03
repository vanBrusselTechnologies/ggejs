module.exports.name = "opt";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{SVF: number, OFF:number, CC2T:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.showVIPFlagOption = params.SVF === 1
    /*
     vipFlagChangedSignal.dispatch();
     rubyPayConfirmData.rubyLimit = paramObj["CC2T"];
     */
}