module.exports = {
    name: "gbd",
    /**
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        for (let x in params) {
            switch (x) {
                case "gpi": require('./gpi').execute(socket, errorCode, params.gpi); break;
                case "gli": require('./gli').execute(socket, errorCode, params.gli); break;
                case "gms": socket.client["maxSpies"] = params.gms.MS; break;
                default: if (socket["debug"]) console.log("Unknown part in gbd command: " + x);
            }
        }
    }
}