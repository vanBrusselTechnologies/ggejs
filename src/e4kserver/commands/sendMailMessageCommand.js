module.exports = {
    execute(socket, receiver, subject, msg) {
        let _subject = getValideSmartFoxJSONMailMessage(subject);
        var _msg = getValideSmartFoxJSONMailMessage(msg);
        if (_msg && _msg != "") {
            let C2SSendMessageVO = {
                params: {
                    RN: receiver,
                    MH: _subject,
                    TXT: _msg,
                },
                getCmdId: "sms"
            }
            require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SSendMessageVO, "lockConditionVO": "new DefaultLockConditionVO()" });
        }
    }
}

function onSendMessage(receiver, subject, msg) {

}

function getValideSmartFoxJSONMailMessage(value) {
    for (var _loc9_ in ["\\+", "#", "<", ">", "\"", "\\$"]) {
        let _loc10_ = new RegExp("\\" + _loc9_, "gs");
        value = value.replace(_loc10_, "");
    }
    value = value.replace(/%/g, "&percnt;");
    value = value.replace(/'/g, "&#145;");
    value = value.replace(/"/g, "&quot;");
    value = value.replace(/\r/g, "<br />");
    value = value.replace(/\\/g, "%5C");
    value = value.replace(/\n/g, "<br />");
    return value.replace(/\t/g, " ");
}