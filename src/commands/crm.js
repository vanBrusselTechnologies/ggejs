const {parseMovement} = require("../utils/MovementParser");

const NAME = "crm";
/** @type {CommandCallback<MarketMovement>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    const marketMovement = parseCRM(client, params);
    if (marketMovement != null) client.movements._add_or_update([marketMovement]);
    require('.').baseExecuteCommand(client, marketMovement, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {InteractiveMapobject} source
 * @param {Mapobject | CastlePosition} target
 * @param {["W" | "S" | "F" | "C" | "O" | "G" | "I" | "A" | "HONEY" | "MEAD", number][]} goods
 * @param {Horse} horse
 * @return {Promise<MarketMovement>}
 */
module.exports.createMarketMovement = function (client, source, target, goods, horse = null) {
    const C2SCreateMarketMovementVO = {
        SID: source.objectId,
        TX: target.position.X,
        TY: target.position.Y,
        G: goods,
        HBW: horse?.wodId ?? -1,
        KID: source.kingdomId,
        PTT: horse?.isPegasusHorse ? 1 : 0,
        SD: 0,
    };
    return require('.').baseSendCommand(client, NAME, C2SCreateMarketMovementVO, callbacks, _ => true);
}

module.exports.crm = parseCRM;

/**
 * @param {BaseClient} client
 * @param {{A: Object, O: Object[]}} params
 * @returns {MarketMovement}
 */
function parseCRM(client, params) {
    if (params === undefined) return null;
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);
    if (params.A === undefined) return null;
    return parseMovement(client, params.A);
}