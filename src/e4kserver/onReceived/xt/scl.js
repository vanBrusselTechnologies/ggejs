const ConstructionSlot = require("../../../structures/ConstructionSlot");

module.exports = {
    name: "scl",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {[]} params
     */
    execute(socket, errorCode, params) {
        const output = [];
        for (let cs of params) {
            output.push(new ConstructionSlot(socket.client, cs))
        }
        return output
    }
}