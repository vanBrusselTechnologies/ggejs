module.exports.name = "apiKO";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    require('../../connection.js').onConnection(socket, {
        "success": false, "error": "API are obsolete, please upgrade"
    });
}