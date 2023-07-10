const CastleUnitInventory = require("../../../structures/CastleUnitInventory");

module.exports = {
    name: "gui",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        return new CastleUnitInventory(socket.client, params)
    }
}