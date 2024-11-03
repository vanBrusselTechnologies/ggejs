module.exports.name = "apiOK";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    require('../../connection.js').onConnection(socket, {"success": true});
}