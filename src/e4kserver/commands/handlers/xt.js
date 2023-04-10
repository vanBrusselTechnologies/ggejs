module.exports = {
    /**
     * @param {Socket} socket
     * @param {string} xtName
     * @param {string} cmd
     * @param {any} paramObj
     * @param {string} type
     * @param {number} roomId
     */
    sendMessage(socket, xtName, cmd, paramObj, type = "xml", roomId = -1) {
        sendXtMessage(socket, xtName, cmd, paramObj, roomId);
    }
}

/**
 * @param {Socket} socket
 * @param {string} xtName
 * @param {string} cmd
 * @param {any} paramObj
 * @param {number} roomId
 */
function sendXtMessage(socket, xtName, cmd, paramObj, roomId = -1) {
    if (!require('./../../room.js').checkRoomList()) return;
    if (roomId === -1) roomId = require('./../../room.js').activeRoomId;
    const a = ["", "xt", xtName, cmd, roomId].concat(paramObj, [""]).join("%");
    require('./../../data.js').writeToSocket(socket, a);
}