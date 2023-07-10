const CastleBuildingStorage = require("../../../structures/CastleBuildingStorage");

module.exports = {
    name: "sin",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {[]} params
     */
    execute(socket, errorCode, params) {
        return new CastleBuildingStorage(socket.client, params);
    }
}