module.exports.name = "esl";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{E: number, TE: number, G: number, TG: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.equipments.equipmentSpaceLeft = params.E;
    socket.client.equipments.equipmentTotalInventorySpace = params.TE;
    socket.client.equipments.gemSpaceLeft = params.G;
    socket.client.equipments.gemTotalInventorySpace = params.TG;
}