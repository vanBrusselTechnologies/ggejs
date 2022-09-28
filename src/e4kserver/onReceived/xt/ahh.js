const {execute: allianceHelpAllCommand} = require("./../../commands/allianceHelpAllCommand");

module.exports = {
    name: "ahh",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(params.AC === 0)
            allianceHelpAllCommand(socket);
    }
}