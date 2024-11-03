module.exports.name = "sms";
/**
 * @param {Socket} socket
 * @param {string} receiverName
 * @param {string} subject
 * @param {string} msg
 */
module.exports.execute = function (socket, receiverName, subject, msg) {
    let _subject = getValideSmartFoxJSONMailMessage(subject);
    let _msg = getValideSmartFoxJSONMailMessage(msg);
    if (_msg && _msg !== "") {
        let C2SSendMessageVO = {
            getCmdId: "sms", params: {RN: receiverName, MH: _subject, TXT: _msg,},
        }
        require('../data').sendCommandVO(socket, C2SSendMessageVO);
    }
}

/**
 *
 * @param {string} value
 * @returns {string}
 */
function getValideSmartFoxJSONMailMessage(value) {
    for (let char in ["\\+", "#", "<", ">", "\"", "\\$"]) {
        let regExp = new RegExp(`\\${char}`, "gs");
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