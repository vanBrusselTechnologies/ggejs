module.exports.name = "acm";
/**
 * @param {Socket} socket
 * @param {string} message
 */
module.exports.execute = function (socket, message) {
    let C2SAllianceChatVO = {
        getCmdId: "acm", params: {M: validateMessage(message)}
    }
    require('../data').sendCommandVO(socket, C2SAllianceChatVO);
}

/**
 *
 * @param {string} msg
 * @returns {string}
 */
function validateMessage(msg) {
    msg = msg.replaceAll(/%/g, "&percnt;")
        .replaceAll(/'/g, "&#145;")
        .replaceAll(/"/g, "&quot;")
        .replaceAll(/</g, "&lt;")
        .replaceAll(/\r/g, "<br />")
        .replaceAll(/\n/g, "<br />")
        .replaceAll(/\\/g, "")
        .replaceAll(/\n/g, "")
        .replaceAll(/\x0b/g, "")
        .replaceAll(/\f/g, "")
        .replaceAll(/\r/g, "")
        .replaceAll(/\t/g, "");
    return msg;
}