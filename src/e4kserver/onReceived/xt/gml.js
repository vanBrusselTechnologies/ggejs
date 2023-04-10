const castleUserData = require('./../../../structures/CastleUserData');
const MonumentMapobject = require("./../../../structures/MonumentMapobject");

module.exports = {
    name: "gml",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        let monuments = [];
        for(let obj of params.AI){
           monuments.push(new MonumentMapobject(socket.client, obj));
        }
        castleUserData.castleListVO.monuments = monuments;
    }
}