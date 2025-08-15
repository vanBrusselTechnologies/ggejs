module.exports.name = "gcs";
/** @param {BaseClient} client */
module.exports.execute = function (client) {
    const C2SGetCharactersStatusVO = {};
    client.socketManager.sendCommand("gcs", C2SGetCharactersStatusVO);
}