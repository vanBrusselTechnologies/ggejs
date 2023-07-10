const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "gkl",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        //castleUserData.castleListVO.kingstowers = castleListParser.parseKingsTowerList(params);
    }
}