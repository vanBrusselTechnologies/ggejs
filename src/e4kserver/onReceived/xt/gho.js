const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "gho",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        castleUserData.userHonor = params["H"];
        castleUserData.userRanking = params["RP"];
    }
}