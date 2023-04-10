const playerInfoModel = require('./../../../structures/PlayerInfoModel');

module.exports = {
    name: "upi",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        playerInfoModel.isPayUser = params["PU"] === 1;
        playerInfoModel.paymentDoublerCount = params["DC"];
    }
}