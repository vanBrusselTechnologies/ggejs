module.exports = {
    name: "core_gpi",
    /**
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params || params.networkId === -1) socket.end();
    }
}