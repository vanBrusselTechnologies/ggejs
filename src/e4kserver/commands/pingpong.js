module.exports.name = "pin";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let PingPongVO = {
        getCmdId: "pin", params: [""],
    }
    require('../data').sendCommandVO(socket, PingPongVO);
}