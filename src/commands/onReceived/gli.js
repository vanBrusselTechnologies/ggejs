const Lord = require("../../structures/Lord");

module.exports.name = "gli";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{B: Object[], C: Object[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const barons = parseLords(client, params.B).sort((l1, l2) => l1.pictureId - l2.pictureId);
    const commandants = parseLords(client, params.C).sort((l1, l2) => l1.pictureId - l2.pictureId);
    client.equipments._setCommandantsAndBarons(barons, commandants);
}

/**
 * @param {BaseClient} client
 * @param {Object[]} data
 * @return {Lord[]}
 */
function parseLords(client, data) {
    return data.map(l => new Lord(client, l));
}