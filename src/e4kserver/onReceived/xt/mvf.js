const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "mvf",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        castleUserData.activeMovementFilters = params["AF"];
    }
}