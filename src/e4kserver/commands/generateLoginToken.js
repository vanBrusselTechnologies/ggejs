module.exports.name = "glt";
/**
 * @param {Socket} socket
 * @param {number} serverType
 */
module.exports.execute = function (socket, serverType) {
    let C2SGenerateLoginTokenVO = {getCmdId: "glt", params: {GST: serverType}}
    require('../data').sendCommandVO(socket, C2SGenerateLoginTokenVO);
}