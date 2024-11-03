const VillageMapobject = require("../../../structures/mapobjects/VillageMapobject");
const InventoryItem = require("../../../structures/InventoryItem");
const Unit = require("../../../structures/Unit");
module.exports.name = "kgv";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const villageList = parseVillageList(socket.client, params);
    socket.client.clientUserData._userData.castleList.publicVillages = villageList.public;
    socket.client.clientUserData._userData.castleList.privateVillages = villageList.private;
}

/**
 *
 * @param {Client} client
 * @param {{VI:[][], PV: {VID: number, XID: number}[]}} data
 * @returns {{ public: { village: VillageMapobject, units?: InventoryItem<Unit>[] }[], private: { privateVillageId: number, uniqueId: number }[]}}
 */
function parseVillageList(client, data) {
    let publicVillagesData = [];
    let privateVillagesData = [];
    if (!data) return {public: publicVillagesData, private: privateVillagesData};
    for (let i in data.VI) {
        let publicVillage = {};
        publicVillage["village"] = new VillageMapobject(client, data.VI[0][0]);
        if (data.VI[i].length >= 2) {
            publicVillage["units"] = parseUnits(client, data.VI[i][1]);
        }
        publicVillagesData.push(publicVillage)
    }
    for (let i in data.PV) {
        privateVillagesData.push({uniqueId: data.PV[i].VID, privateVillageId: data.PV[i].XID});
    }
    return {public: publicVillagesData, private: privateVillagesData};
}

/**
 *
 * @param {Client} client
 * @param {Array<[number, number]>} data
 * @returns {InventoryItem<Unit>[]}
 */
function parseUnits(client, data) {
    if (!data) return [];
    return data.map(d => {
        return new InventoryItem(new Unit(client, d[0]), d[1])
    })
}