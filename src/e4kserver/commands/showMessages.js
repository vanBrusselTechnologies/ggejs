module.exports.name = "sne";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    socket['isWaitingForSNE'] = true;
    let C2SShowMessagesVO = {
        getCmdId: "sne", params: {}
    }
    require('../data').sendCommandVO(socket, C2SShowMessagesVO);
}