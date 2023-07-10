const CastleBuildings = require("../../../structures/CastleBuildingInfo");

module.exports = {
    name: "gca", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        return new CastleBuildings(socket.client, params);
    }
}