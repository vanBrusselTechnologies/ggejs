const {execute: gam} = require("./gam");
const {execute: gcu} = require("./gcu");

module.exports.name = "cdd";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{gcu: {C1: number, C2: number}, A:{}, O:[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    socket.client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);
    gam(socket, 0, {M: [params.A]});
    gcu(socket, 0, params.gcu);
}