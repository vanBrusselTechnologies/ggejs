module.exports = {
    name: "gcl",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        //socket.client.castleUserData.castleListVO.ownerId = 0;
        if(!params) return;
        //socket.client.castleUserData.castleListVO.castles = castleListParser.parseCastleList(paramObject,worldMapOwnerInfoData.getOwnerInfoVO(0));
    }
}