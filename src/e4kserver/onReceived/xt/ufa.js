module.exports = {
    name: "ufa",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket.client["fame"] = params["CF"];
        socket.client["highestFame"] = params["HF"];
    }
}