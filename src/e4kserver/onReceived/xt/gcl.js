const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "gcl",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        //castleUserData.castleListVO.ownerId = 0;
        if(!params) return;
        //castleUserData.castleListVO.castles = castleListParser.parseCastleList(paramObject,worldMapOwnerInfoData.getOwnerInfoVO(0));
    }
}