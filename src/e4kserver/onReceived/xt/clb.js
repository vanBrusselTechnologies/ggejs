const {execute: alb} = require('./alb.js');

module.exports.name = "clb";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{alb:{D:number, R:Object[]}}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    alb(socket, errorCode, params.alb);
}