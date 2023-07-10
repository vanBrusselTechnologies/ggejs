const CastleResourceStorage = require("../../../structures/CastleResourceStorage");

module.exports = {
    name: "grc", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        return new CastleResourceStorage(socket.client, params);
    }
}