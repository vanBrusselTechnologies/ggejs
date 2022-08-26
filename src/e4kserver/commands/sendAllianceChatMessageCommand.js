module.exports = {
    name: "acm",
    execute(socket, message) {
        let C2SAllianceChatVO = {
            getCmdId: "acm",
            params: {
                M: validateMessage(message)
            },
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SAllianceChatVO, "lockConditionVO": null });
    }
}

function validateMessage(msg) {
    msg = msg.replace(/%/g, "&percnt;")
        .replace(/'/g, "&#145;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/\r/g, "<br />")
        .replace(/\n/g, "<br />")
        .replace(/\\/g, "")
        .replace(/\n/g, "")
        .replace(/\x0b/g, "")
        .replace(/\f/g, "")
        .replace(/\r/g, "")
        .replace(/\t/g, "");
    return msg;
}