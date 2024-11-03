const onJson = require('./onReceived/handlers/json.js');
const onString = require('./onReceived/handlers/string.js');
const onXml = require('./onReceived/handlers/xml.js');
const xt = require('./commands/handlers/xt');

/**
 * @param {Socket} socket
 * @param {Buffer} data
 */
module.exports.onData = function (socket, data) {
    let msg = data.toString('utf-8');
    if (msg.charCodeAt(msg.length - 1) !== 0) {
        socket["unfinishedDataString"] = socket["unfinishedDataString"] + msg;
        return;
    }
    msg = socket["unfinishedDataString"] + msg;
    socket["unfinishedDataString"] = "";
    const msgParts = [];
    const msgChars = msg.split("");
    let _msgPart = "";
    for (let i = 0; i < msgChars.length; i++) {
        if (msgChars[i].charCodeAt(0) === 0) {
            if (_msgPart !== "") msgParts.push(_msgPart);
            _msgPart = "";
        } else {
            _msgPart += msgChars[i];
            if (i === msgChars.length - 1 && _msgPart !== "") msgParts.push(_msgPart);
        }
    }
    for (let i = 0; i < msgParts.length; i++) {
        let _msg = msgParts[i];
        if (socket["ultraDebug"]) {
            console.log(`[RECEIVED]: ${_msg.substring(0, Math.min(150, msg.length))}`);
        }
        let firstChar = _msg.charAt(0);
        let lastChar = msgParts[i].charAt(msgParts[i].length - 1);
        if (firstChar === "<" && lastChar === ">") {
            onXml.execute(socket, _msg);
        } else if (firstChar === "%" && lastChar === "%") {
            onString.execute(socket, _msg);
        } else if (firstChar === "{" && lastChar === "}") {
            onJson.execute(socket, _msg);
        } else if (socket.debug) {
            console.warn("received unfinished message!", msgParts[i]);
        }
    }
}

/**
 * @param {Socket} socket
 * @param {{getCmdId: string, params: Object}} commandVO
 */
module.exports.sendCommandVO = function (socket, commandVO) {
    let msgId = commandVO.getCmdId;
    let params = [JSON.stringify(commandVO.params)];
    let i = 0;
    while (i < params.length) {
        params[i] ? "string" == typeof params[i] && (params[i] = getValideSmartFoxText(params[i])) : params[i] = "<RoundHouseKick>";
        i++;
    }
    if(socket?.client == null) return;
    xt.sendMessage(socket, socket.client._serverInstance.zone, msgId, params, "str", socket["_activeRoomId"]);
}

/**
 *
 * @param {string} value
 * @returns {string}
 */
function getValideSmartFoxText(value) {
    value = value.replace(/%/g, "&percnt;");
    return value.replace(/'/g, "");
}

/**
 * @param {Socket} socket
 * @param {string} msg
 */
module.exports.writeToSocket = function (socket, msg) {
    if (!socket?._host || socket["__connected"] === false || socket["__disconnecting"] || socket.closed) return;
    if (socket["ultraDebug"]) console.log(`[WRITE]: ${msg.substring(0, Math.min(150, msg.length))}`);
    let _buff0 = Buffer.from(msg);
    let _buff1 = Buffer.alloc(1);
    _buff1.writeInt8(0);
    let bytes = Buffer.concat([_buff0, _buff1]);
    if (!socket?._host || socket["__connected"] === false || socket["__disconnecting"] || socket.closed) return;
    socket.write(bytes, "utf-8", (err) => {
        if (err) {
            console.error(`\x1b[31m[SOCKET WRITE ERROR] ${err}\x1b[0m`);
        }
    });
}