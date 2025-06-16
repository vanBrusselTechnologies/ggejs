module.exports.name = "acm";
/**
 * @param {Client} client
 * @param {string} message
 */
module.exports.execute = function (client, message) {
    const C2SAllianceChatVO = {M: validateMessage(message)};
    client.socketManager.sendCommand("acm", C2SAllianceChatVO);
}

/** @param {string} msg */
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