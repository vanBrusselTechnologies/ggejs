const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "gpf",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (!params) return;
        castleUserData.hasPremiumFlag = params["PF"] === 1 || params["PF"];
    }
}