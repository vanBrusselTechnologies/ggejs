module.exports = {
    name: "core_nfo",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        socket["__connected"] = true;
    }
}