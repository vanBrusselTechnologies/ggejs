module.exports = {
    name: "gpi",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket.client.players._setThisPlayer(params.PID);
        /*
    UID: number;
    PID: number;
    PN: string;
    E: string;
    V: 1,
    CTAC: 1,
    CL: 0,
    RD: number;
    ECN: 1,
    FCR: 0
        */
    }
}