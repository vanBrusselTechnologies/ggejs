const {parseMapObject} = require("../../../utils/MapObjectParser");

module.exports.name = "wsp";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{X:number, Y:number, gaa:{KID:number, AI:[], OI:[]}}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode !== 0) {
        client._socket[`__search_player_error`] = (() => {
            switch (errorCode) {
                case 21:
                    return "player_not_found";
                case 96:
                    return "player_not_on_map";
                case 28:
                    return "generic_register_namenotvalid";
                default:
                    return `WSP error code: ${errorCode}`
            }
        })();
        return;
    }
    const ownerInfo = client.worldMaps._ownerInfoData.parseOwnerInfo(params.gaa.OI[0])
    parseMapObject(client, params.gaa.AI[0])
    const name = ownerInfo.playerName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    client._socket[`__search_player_${name}`] = ownerInfo.playerId;
}