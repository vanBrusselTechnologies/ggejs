const { execute: parseGCA } = require('./gca');
const { execute: parseGUI } = require('./gui');
const { execute: parseGRC } = require('./grc');
const { execute: parseGPA } = require('./gpa');

module.exports = {
    name: "jaa",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (params === undefined) return;
        let output = {}
        for (let x in params) {
            switch (x) {
                case "gca": output["castle"] = parseGCA(socket, 0, params[x]); break;
                case "gui": output["troops"] = parseGUI(socket, 0, params[x]); break;
                case "grc": output["resources"] = parseGRC(socket, 0, params[x]); break;
                case "gpa": output["production"] = parseGPA(socket, 0, params[x]); break;
                default: if (socket.debug) console.log("Unknown part in jaa command: " + x);
            }
        }
        socket[`join_area_${params.gca.A[3]}_data`] = output;
        socket[`join_area_${params.gca.A[3]}_finished`] = true;
    }
}