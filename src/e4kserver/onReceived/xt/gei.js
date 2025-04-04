const Equipment = require("../../../structures/Equipment");
const RelicEquipment = require("../../../structures/RelicEquipment");

module.exports.name = "gei";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{I:[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const client = socket.client;
    /**@type{Equipment[] | RelicEquipment[]}*/
    const equipments = [];
    for (const d of params.I) {
        const eq = d[11] === 3 ? new RelicEquipment(client, d) : new Equipment(client, d);
        equipments.push(eq);
    }
    socket.client.equipments._setEquipmentInventory(equipments);
    (async () => {
        try {
            await socket.client.equipments.sellAllEquipmentsAtOrBelowRarity(-1);
        } catch (e) {
        }
    })();
}