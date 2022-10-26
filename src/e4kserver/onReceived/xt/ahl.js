const {execute: allianceHelpAllCommand} = require("./../../commands/allianceHelpAllCommand");

module.exports = {
    name: "ahl",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        let _allianceHelpRequestList = params.AHL
        if(_allianceHelpRequestList.length === 0) return;
        for(let i in _allianceHelpRequestList){
            let helpRequest = _allianceHelpRequestList[i];
            if(helpRequest.AC === 0 && helpRequest.PID !== socket["___this_player_id"]){
                allianceHelpAllCommand(socket);
                return;
            }
        }
    }
}