module.exports.name = "esl";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{E: number, TE: number, G: number, TG: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.equipments.equipmentSpaceLeft = params.E;
    client.equipments.equipmentTotalInventorySpace = params.TE;
    client.equipments.gemSpaceLeft = params.G;
    client.equipments.gemTotalInventorySpace = params.TG;
}