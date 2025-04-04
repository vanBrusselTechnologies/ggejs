const Lord = require("../../../structures/Lord");

module.exports.name = "gli";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const barons = parseLords(socket.client, params.B).sort((l1, l2) => l1.pictureId - l2.pictureId);
    const commandants = parseLords(socket.client, params.C).sort((l1, l2) => l1.pictureId - l2.pictureId);
    socket.client.equipments._setCommandantsAndBarons(barons, commandants);
}

/**
 * @param client
 * @param data
 * @return {Lord[]}
 */
function parseLords(client, data) {
    const lords = [];
    for (let i in data) {
        lords.push(new Lord(client, data[i]));
    }
    return lords;
}