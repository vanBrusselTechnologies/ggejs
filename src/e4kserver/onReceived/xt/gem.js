const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "gem",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        castleUserData.mayChangeCrest = params["MCE"] === 1;
        castleUserData.playerCrest = {
            backgroundType: params["BGT"],
            backgroundColor1: params["BGC1"],
            backgroundColor2: params["BGT"] === 0 ? params["BGC1"] : params["BGC2"],
            symbolPosType: params["SPT"],
            symbolType1: params["S1"],
            symbolType2: params["S2"],
            symbolColor1: params["SC1"],
            symbolColor2: params["SC2"],
        };
        if(socket.debug) console.log("gem playerCrest is not CrestVO");
    }
}