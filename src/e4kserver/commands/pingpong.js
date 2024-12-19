module.exports.name = "pin";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const PingPongVO = {
        getCmdId: "pin", params: [""],
    }
    require('../data').sendCommandVO(socket, PingPongVO);
}