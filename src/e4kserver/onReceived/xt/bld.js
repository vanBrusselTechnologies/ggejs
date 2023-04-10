module.exports = {
    name: "bld",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        console.log("BLD!!: " + params)
    }
}