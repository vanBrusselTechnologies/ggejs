const {parseMapObject} = require("../../../utils/MapObjectParser");
const Good = require("../../../structures/Good");

module.exports.name = "mmn";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (params == null || !params["gaa"]?.["AI"]) {
        socket[`mmn -> errorCode`] = errorCode;
        return;
    }
    const client = socket.client;
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O)
    const areas = parseWorldMapAreas(client, params["gaa"]["AI"]);
    const goods = params.R.map(g => new Good(client, g));
    socket[`mmn -> ${params.MID}`] = {
        messageId: params.MID, sourceArea: areas[0], targetArea: areas[1], goods: goods,
    };
}

/**
 * @param {Client} client
 * @param {[]} data
 */
function parseWorldMapAreas(client, data) {
    return data.map(d => parseMapObject(client, d));
}