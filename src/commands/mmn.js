const Good = require("../structures/Good");
const {parseMapObject} = require("../utils/MapObjectParser");

const NAME = "mmn";
/** @type {CommandCallback<TradeData>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const tradeData = parseMMN(client, params);
    require('.').baseExecuteCommand(client, tradeData, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} messageId
 * @return {Promise<TradeData>}
 */
module.exports.marketCarriageNotify = function (client, messageId) {
    const C2SMarketCarriageNotifyVO = {MID: messageId};
    return require('.').baseSendCommand(client, NAME, C2SMarketCarriageNotifyVO, callbacks, (p) => p?.["MID"] === messageId);
}

module.exports.mmn = parseMMN;

/**
 * @param {BaseClient} client
 * @param {Object} params
 * @return {TradeData}
 */
function parseMMN(client, params) {
    if (params == null || !params["gaa"]?.["AI"]) return null;
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);
    const areas = parseWorldMapAreas(client, params["gaa"]["AI"]);
    const goods = params.R.map(g => new Good(g));
    return {messageId: params.MID, sourceArea: areas[0], targetArea: areas[1], goods: goods};
}

/**
 * @param {BaseClient} client
 * @param {[]} data
 */
function parseWorldMapAreas(client, data) {
    return data.map(d => parseMapObject(client, d));
}