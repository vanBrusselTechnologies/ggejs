const Equipment = require("../../structures/Equipment");
const RelicEquipment = require("../../structures/RelicEquipment");

module.exports.name = "gei";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{I:[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    /**@type{Equipment[] | RelicEquipment[]}*/
    const equipments = [];
    for (const d of params.I) {
        const eq = d[11] === 3 ? new RelicEquipment(client, d) : new Equipment(client, d);
        equipments.push(eq);
    }
    client.equipments._setEquipmentInventory(equipments);
    (async () => {
        try {
            await client.equipments.sellAllEquipmentsAtOrBelowRarity(-1);
        } catch (e) {
        }
    })();
}