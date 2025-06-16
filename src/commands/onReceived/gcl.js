const {parseMapObject} = require("../../utils/MapObjectParser");

module.exports.name = "gcl";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.clientUserData._userData.castleList.ownerId = 0;
    if (!params) return;
    const ownerInfo = client.worldMaps._ownerInfoData.getOwnerInfo(client.clientUserData.playerId);
    const castleList = {};
    if (!params) return {};
    for (const castle of params["C"]) {
        const mapObjects = [];
        for (const data of castle["AI"]) {
            let mapObject = parseMapObject(client, data["AI"]);
            if (data["OGT"]) {
                mapObject.remainingOpenGateTime = data["OGT"];
            }
            if (data["OGC"]) {
                mapObject.openGateCounter = data["OGC"];
            }
            if (data["AOT"]) {
                mapObject.remainingAbandonOutpostTime = data["AOT"];
            }
            if (data["TA"]) {
                mapObject.remainingCooldownAbandonOutpostTime = data["TA"];
            }
            if (data["CAT"]) {
                mapObject.remainingCancelAbandonTime = data["CAT"];
            }
            mapObject.ownerInfo = ownerInfo;
            mapObjects.push(mapObject);
        }
        castleList[castle["KID"]] = mapObjects;
    }
    client.clientUserData._userData.castleList.castles = castleList;
}