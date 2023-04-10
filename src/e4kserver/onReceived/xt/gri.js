const castleUserData = require('./../../../structures/CastleUserData');
const {Coordinate} = require("./../../../structures/Coordinate");

module.exports = {
    name: "gri",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        castleUserData.relocationCount = params["RLC"];
        castleUserData.relocationDurationEndTime = new Date(Date.now() + Math.max(0,params["RD"]) * 1000);
        castleUserData.relocationCooldownEndTime = new Date(Date.now() + Math.max(0,params["RMC"]) * 1000);
        if(params["JM"] && params["JM"] === 1){
            castleUserData.relocationDurationEndTime = new Date();
        }
        if(params["DX"] && params["DY"]) {
            castleUserData.relocationDestination = new Coordinate(socket.client, [params["DX"], params["DY"]]);
        }
    }
}