module.exports.name = "gcs";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetCharactersStatusVO = {getCmdId: "gcs", params: {}}
    require('../data').sendCommandVO(socket, C2SGetCharactersStatusVO);
}