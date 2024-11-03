const {execute: gam} = require("./gam");
const {execute: gcu} = require("./gcu");

module.exports.name = "css";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    gam(socket, 0, {M: [params.A]});
    gcu(socket, 0, params.gcu);
}