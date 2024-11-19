const RelicGem = require("../../../structures/RelicGem");
const Gem = require("../../../structures/Gem");

module.exports.name = "ggm";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{GEM: [number, number][], RGEM: (number | number[])[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.equipments._setRegularGemInventory(params.GEM.map(gemId_amount => {
        return {gem: new Gem(socket.client, gemId_amount[0]), amount: gemId_amount[1]}
    }));
    socket.client.equipments._setRelicGemInventory(params.RGEM.map(gem => {
        new RelicGem(socket.client, gem)
    }));
    (async () => {
        try {
            await socket.client.equipments.sellAllGemsAtOrBelowLevel(-1)
        } catch (e) {
        }
    })()
}