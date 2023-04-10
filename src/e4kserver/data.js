const onJson = require('./onReceived/handlers/json.js');
const onString = require('./onReceived/handlers/string.js');
const onXml = require('./onReceived/handlers/xml.js');
const xt = require('./commands/handlers/xt');

/**
 * @param {Socket} socket
 * @param {Buffer} data
 */
function internal_OnData(socket, data) {
    let msg = data.toString('utf-8');
    if (msg.charCodeAt(msg.length - 1) !== 0) {
        socket["unfinishedDataString"] = socket["unfinishedDataString"] + msg;
        return;
    }
    msg = socket["unfinishedDataString"] + msg;
    if(socket.debug ) console.log("[RECEIVED]: " + msg.substring(0, Math.min(250, msg.length)));
    socket["unfinishedDataString"] = "";
    let msgParts = [];
    let msgChars = msg.split("");
    let _msgPart = "";
    for (let i = 0; i < msgChars.length; i++) {
        if (msgChars[i].charCodeAt(0) === 0) {
            if (_msgPart !== "")
                msgParts.push(_msgPart);
            _msgPart = "";
        }
        else {
            _msgPart += msgChars[i];
            if (i === msgChars.length - 1 && _msgPart !== "")
                msgParts.push(_msgPart);
        }
    }
    for (let i = 0; i < msgParts.length; i++) {
        let _msg = msgParts[i];
        let firstChar = _msg.charAt(0);
        let lastChar = msgParts[i].charAt(msgParts[i].length - 1);
        if (firstChar === "<" && lastChar === ">") {
            onXml.execute(socket, _msg);
        }
        else if (firstChar === "%" && lastChar === "%") {
            onString.execute(socket, _msg);
        }
        else if (firstChar === "{" && lastChar === "}") {
            onJson.execute(socket, _msg);
        }
        else
            if (socket.debug){
                console.log("received unfinished message!");
                console.log(msgParts[i]);
            }
    }
}

/**
 * @param {Socket} socket
 * @param {object} commandVO
 */
function sendCommandVO(socket, commandVO) {
    let msgId = commandVO.getCmdId;
    let params = [JSON.stringify(commandVO.params)];
    let i = 0;
    while (i < params.length) {
        0 === params[i] ?
            params[i] = "0" :
            params[i] ?
                "string" == typeof params[i] && (params[i] = getValideSmartFoxText(params[i])) :
                params[i] = "<RoundHouseKick>";
        //if (params[i].trim() === "" || params[i].trim() === "{}") {
        //    params[i] = "<RoundHouseKick>";
        //}
        //params[i] = getValideSmartFoxText(params[i]);
        i++;
    }
    xt.sendMessage(socket, socket.client._serverInstance.zone, msgId, params, "str", require('./room.js').activeRoomId);
}

/**
 * 
 * @param {string} value
 */
function getValideSmartFoxText(value) {
    value = value.replace(/%/g, "&percnt;");
    return value.replace(/'/g, "");
}

/**
 * @param {Socket} socket
 * @param {string} msg
 */
function internal_writeToSocket(socket, msg) {
    if(socket.debug) console.log("[WRITE]: " + msg);
    let _buff0 = Buffer.from(msg);
    let _buff1 = Buffer.alloc(1);
    _buff1.writeInt8(0);
    let bytes = Buffer.concat([_buff0, _buff1]);
    socket.write(bytes, "utf-8", (err) => { if (err) { console.log("\x1b[31m[SOCKET ERROR] " + err + "\x1b[0m"); } });
}

module.exports = {
    /**
     * @param {Socket} socket
     * @param {Buffer} data
     */
    onData(socket, data) {
        internal_OnData(socket, data);
    },
    /**
     * @param {Socket} socket
     * @param {object} sendJsonMessageVO
     */
    sendJsonVoSignal(socket, sendJsonMessageVO) {
        sendCommandVO(socket, sendJsonMessageVO.commandVO);
    },
    /**
     * @param {Socket} socket
     * @param {string} msg
     */
    writeToSocket(socket, msg) {
        internal_writeToSocket(socket, msg);
    }
}