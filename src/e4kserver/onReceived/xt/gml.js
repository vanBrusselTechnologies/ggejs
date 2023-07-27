const castleUserData = require('./../../../structures/CastleUserData');
const MonumentMapobject = require("../../../structures/mapobjects/MonumentMapobject");

module.exports.name = "gml";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    let monuments = [];
    for (let obj of params.AI) {
        monuments.push(new MonumentMapobject(socket.client, obj));
    }
    castleUserData.castleListVO.monuments = monuments;
}