module.exports = {
    execute(socket, receiver, subject, msg) {
        let _subject = getValideSmartFoxJSONMailMessage(subject);
        let _msg = getValideSmartFoxJSONMailMessage(msg);
        if (_msg && _msg !== "") {
            let C2SSendMessageVO = {
                params: {
                    RN: receiver, MH: _subject, TXT: _msg,
                }, getCmdId: "sms"
            }
            require('./../data').sendJsonVoSignal(socket, {
                "commandVO": C2SSendMessageVO, "lockConditionVO": "new DefaultLockConditionVO()"
            });
        }
    }
}

/**
 *
 * @param {string} value
 * @returns {string}
 */
function getValideSmartFoxJSONMailMessage(value) {
    for (let _loc9_ in ["\\+", "#", "<", ">", "\"", "\\$"]) {
        let _loc10_ = new RegExp("\\" + _loc9_, "gs");
        value = value.replaceAll(_loc10_, "");
    }
    value = value.replaceAll(/%/g, "&percnt;");
    value = value.replaceAll(/'/g, "&#145;");
    value = value.replaceAll(/"/g, "&quot;");
    value = value.replaceAll(/\r/g, "<br />");
    value = value.replaceAll(/\\/g, "%5C");
    value = value.replaceAll(/\n/g, "<br />");
    return value.replaceAll(/\t/g, " ");
}