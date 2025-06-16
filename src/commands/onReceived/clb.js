const {execute: alb} = require('./alb.js');

module.exports.name = "clb";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{alb:{D:number, R:Object[]}}} params
 */
module.exports.execute = function (client, errorCode, params) {
    alb(client, errorCode, params.alb);
}