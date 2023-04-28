const Equipment = require("../../../structures/Equipment");
const RelicEquipment = require("../../../structures/RelicEquipment");
module.exports = {
    name: "gei", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {{I:[]}} params
     */
    execute(socket, errorCode, params) {
        if (!params) return;
        const client = socket.client;
        /**@type{Equipment[] | RelicEquipment[]}*/
        const equipments = [];
        for (const d of params.I) {
            if (d[11] === 3) equipments.push(new RelicEquipment(client, d)); else equipments.push(new Equipment(client, d));
        }
        socket.client.equipments._setEquipmentInventory(equipments);
    }
}