const playerEquipmentData = require('../../../structures/PlayerEquipmentData');
const RelicGem = require("../../../structures/RelicGem");
const Gem = require("../../../structures/Gem");

module.exports.name = "ggm";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    playerEquipmentData.gemData.regularInventory = [];
    for (let gem of params["GEM"]) {
        playerEquipmentData.gemData.regularInventory.push({gem: new Gem(socket.client, gem[0]), amount: gem[1]});
    }
    for (let gem of params["RGEM"]) {
        playerEquipmentData.gemData.relicInventory.push(new RelicGem(socket.client, gem));
    }
}