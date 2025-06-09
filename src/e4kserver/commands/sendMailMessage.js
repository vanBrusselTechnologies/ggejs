module.exports.name = "sms";
/**
 * @param {Socket} socket
 * @param {string} receiverName
 * @param {string} subject
 * @param {string} msg
 */
module.exports.execute = function (socket, receiverName, subject, msg) {
    const _subject = getValideSmartFoxJSONMailMessage(subject);
    const _msg = getValideSmartFoxJSONMailMessage(msg);
    if (_msg && _msg !== "") {
        const C2SSendMessageVO = {RN: receiverName, MH: _subject, TXT: _msg};
        socket.client.socketManager.sendCommand("sms", C2SSendMessageVO);
    }
}

/** @param {string} value */
function getValideSmartFoxJSONMailMessage(value) {
    for (const char in ["\\+", "#", "<", ">", "\"", "\\$"]) {
        const regExp = new RegExp(`\\${char}`, "gs");
        value = value.replaceAll(regExp, "");
    }
    value = value.replaceAll(/%/g, "&percnt;");
    value = value.replaceAll(/'/g, "&#145;");
    value = value.replaceAll(/"/g, "&quot;");
    value = value.replaceAll(/\r/g, "<br />");
    value = value.replaceAll(/\\/g, "%5C");
    value = value.replaceAll(/\n/g, "<br />");
    return value.replaceAll(/\t/g, " ");
}