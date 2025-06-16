const {execute: pingPong} = require('../../commands/pingpong.js');

module.exports.name = "pin";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{NP:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    let nextPingTimeout = 15000;
    if (errorCode === 0 && params && params.NP) {
        nextPingTimeout = params.NP * 1000;
    }
    if (client._socket["inPingTimeout"]) return;
    client._socket["inPingTimeout"] = true;
    setTimeout(function () {
        client._socket["inPingTimeout"] = false;
        pingPong(client);
    }, nextPingTimeout);
}