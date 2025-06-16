const RelicGem = require("../../../structures/RelicGem");
const Gem = require("../../../structures/Gem");

module.exports.name = "ggm";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{GEM: [number, number][], RGEM: (number | number[])[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.equipments._setRegularGemInventory(params.GEM.map(gemId_amount => {
        return {gem: new Gem(client, gemId_amount[0]), amount: gemId_amount[1]}
    }));
    client.equipments._setRelicGemInventory(params.RGEM.map(gem => new RelicGem(client, gem)));
    (async () => {
        try {
            await client.equipments.sellAllGemsAtOrBelowLevel(-1);
        } catch (e) {
        }
    })();
}