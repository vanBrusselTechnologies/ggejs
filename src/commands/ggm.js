const Gem = require("../structures/Gem");
const RelicGem = require("../structures/RelicGem");

const NAME = "ggm";
/** @type {CommandCallback<{regular: {gem: Gem, amount: number}[], relic: RelicGem[]}>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseGGM(client, params);
    require('.').baseExecuteCommand(undefined, errorCode, params, callbacks);
}

/** @param {Client} client */
module.exports.getGemInventory = function (client) {
    const C2SGetGemInventory = {};
    return require('.').baseSendCommand(client, NAME, C2SGetGemInventory, callbacks, (_) => true);
}

module.exports.ggm = parseGGM;

/**
 * @param {Client} client
 * @param {{GEM: [number, number][], RGEM: (number | number[])[]}} params
 */
function parseGGM(client, params) {
    if (!params) return null;
    client.equipments._setRegularGemInventory(params.GEM.map(g => {
        return {gem: new Gem(client, g[0]), amount: g[1]}
    }));
    client.equipments._setRelicGemInventory(params.RGEM.map(gem => new RelicGem(client, gem)));
}