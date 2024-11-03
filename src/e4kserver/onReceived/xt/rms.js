const {parseChatJSONMessage} = require("../../../tools/TextValide");
module.exports.name = "rms";
/**
 *
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{MID:number, MTXT: string}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params?.MTXT) return;
    socket[`rms -> ${params.MID}`] = parseChatJSONMessage(params.MTXT);
}