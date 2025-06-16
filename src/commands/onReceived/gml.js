const MonumentMapobject = require("../../structures/mapobjects/MonumentMapobject");

module.exports.name = "gml";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{AI: []}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData._userData.castleList.monuments = params.AI.map(o => new MonumentMapobject(client, o));
}