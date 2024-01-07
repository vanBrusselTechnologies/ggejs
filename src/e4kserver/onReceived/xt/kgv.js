module.exports.name = "kgv";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    //socket.client.castleUserData.castleListVO.publicVillages = castleListParser.parsePublicVillageList(params, worldMapOwnerInfoData.ownInfoVO);
    //socket.client.castleUserData.castleListVO.privateVillages = castleListParser.parsePrivateVillageList(params, worldMapOwnerInfoData.ownInfoVO);
}