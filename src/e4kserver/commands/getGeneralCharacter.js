module.exports.name = "gcs";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let C2SGetCharactersStatusVO = {
        getCmdId: "gcs", params: {}
    }
    require('../data').sendCommandVO(socket, C2SGetCharactersStatusVO);
}