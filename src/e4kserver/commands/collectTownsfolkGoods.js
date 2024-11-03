module.exports.name = "irc";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let C2SResourceCitizenVO = {
        getCmdId: "irc", params: {}
    }
    require('../data').sendCommandVO(socket, C2SResourceCitizenVO);
}