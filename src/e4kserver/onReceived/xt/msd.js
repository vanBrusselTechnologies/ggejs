const {parseMapObject} = require("../../../utils/MapObjectParser");
const {execute: sce} = require('./sce');

module.exports.name = "msd";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{sce: [string, number][], AI:[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    sce(socket, errorCode, params.sce)
    parseMapObject(socket.client, params.AI);
}