const CastleProductionData = require("../../../structures/CastleProductionData");

module.exports = {
    name: "gpa", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        return new CastleProductionData(socket.client, params);
    }
}