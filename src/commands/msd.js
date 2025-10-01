const {execute: sce} = require("./onReceived/sce");
const {parseMapObject} = require("../utils/MapObjectParser");

const NAME = "msd";
/** @type {CommandCallback<Mapobject>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{sce: [string, number][], AI:[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (params?.sce) sce(client, errorCode, params.sce);
    const mapObject = params?.AI ? parseMapObject(client, params.AI) : undefined;
    require('.').baseExecuteCommand(client, mapObject, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {string} minuteSkipType
 * @param {number} kingdomId
 * @param {number} xPos
 * @param {number} yPos
 * @param {number} mapId
 * @param {number} nodeId
 * @return {Promise<Mapobject>}
 */
module.exports.minuteSkipDungeon = function (client, minuteSkipType, kingdomId, xPos, yPos, mapId = -1, nodeId = -1) {
    const C2SMinuteSkipDungeonVO = {
        MST: minuteSkipType,
        KID: kingdomId.toString(),
        MID: mapId,
        NID: nodeId,
        X: xPos,
        Y: yPos
    };
    return require('.').baseSendCommand(client, NAME, C2SMinuteSkipDungeonVO, callbacks, (p) => xPos === p?.["AI"]?.[1] && yPos === p?.["AI"]?.[2]);
}