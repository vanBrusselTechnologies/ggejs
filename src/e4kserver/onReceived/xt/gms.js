module.exports = {
    name: "gms",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket.client["maxSpies"] = params["MS"];
    }
}