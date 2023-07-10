module.exports = {
    name: "gab",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {{B:number}} params
     * @returns {number}
     */
    execute(socket, errorCode, params) {
        if(!params?.B) return 0;
        return params.B;
    }
}