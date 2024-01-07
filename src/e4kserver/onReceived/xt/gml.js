const MonumentMapobject = require("../../../structures/mapobjects/MonumentMapobject");

module.exports.name = "gml";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const monuments = [];
    for (let obj of params.AI) {
        monuments.push(new MonumentMapobject(socket.client, obj));
    }
    //socket.client.castleUserData.castleListVO.monuments = monuments;
}