const {execute: gam} = require("./gam");
const {execute: gcu} = require("./gcu");

module.exports.name = "cds";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params || errorCode === 197 || errorCode === 199 || errorCode === 91 || errorCode === 101 || errorCode === 218) return;
    gam(socket, 0, {M: [params.A]});
    gcu(socket, 0, params.gcu);
}