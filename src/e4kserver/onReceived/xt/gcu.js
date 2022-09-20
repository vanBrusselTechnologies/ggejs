module.exports = {
    name: "gcu",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket.client["C1"] = params.C1;
        socket.client["C2"] = params.C2;
    }
}