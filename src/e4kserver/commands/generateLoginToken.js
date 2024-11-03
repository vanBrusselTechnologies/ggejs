module.exports.name = "glt";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let C2SGenerateLoginTokenVO = {getCmdId: "glt", params: {GST: socket["currentServerType"]}}
    require('../data').sendCommandVO(socket, C2SGenerateLoginTokenVO);
}