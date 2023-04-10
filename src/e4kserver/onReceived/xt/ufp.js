module.exports = {
    name: "ufp",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket.client["factionPoints"] = params["CFP"];
        socket.client["highestFactionPoints"] = params["HFP"];
    }
}