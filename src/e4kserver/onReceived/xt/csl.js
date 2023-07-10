module.exports = {
    name: "csl",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {{SL:number}} params
     */
    execute(socket, errorCode, params) {
        if(!params) return -1;
        return params.SL;
    }
}