module.exports = {
    name: "tse",
    /**
     *
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket["currentServerType"] = params.GST;
    }
}