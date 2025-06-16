const {parseChatJSONMessage} = require("../../../tools/TextValide");

module.exports.name = "rms";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{MID:number, MTXT: string}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params?.MTXT) return;
    client._socket[`rms -> ${params.MID}`] = parseChatJSONMessage(params.MTXT);
}