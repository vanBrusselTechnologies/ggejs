module.exports.name = "glt";
/**
 * @param {Client} client
 * @param {number} serverType
 */
module.exports.execute = function (client, serverType) {
    const C2SGenerateLoginTokenVO = {GST: serverType};
    client.socketManager.sendCommand("glt", C2SGenerateLoginTokenVO);
}