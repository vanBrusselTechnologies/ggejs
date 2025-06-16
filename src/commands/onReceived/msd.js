const {parseMapObject} = require("../../utils/MapObjectParser");
const {execute: sce} = require('./sce');

module.exports.name = "msd";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{sce: [string, number][], AI:[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    sce(client, errorCode, params.sce);
    parseMapObject(client, params.AI);
}