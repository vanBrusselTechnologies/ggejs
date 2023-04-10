const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "kgv",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        //castleUserData.castleListVO.publicVillages = castleListParser.parsePublicVillageList(params,worldMapOwnerInfoData.ownInfoVO);
        //castleUserData.castleListVO.privateVillages = castleListParser.parsePrivateVillageList(params,worldMapOwnerInfoData.ownInfoVO);
    }
}