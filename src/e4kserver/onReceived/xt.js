const path = require('node:path');
const fs = require('fs');
const {getErrorText} = require("../../utils/ErrorConst");

let commands = [];
const commandPath = path.join(__dirname, './xt');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    commands[command.name] = command.execute;
}

/**
 * @param {Socket} socket
 * @param {string[]} params
 */
module.exports.onResponse = function (socket, params) {
    const commandId = params.shift();
    params.shift();
    const errorCode = parseInt(params.shift());
    switch (errorCode) {
        case 0:
        case 10005:
            executeResponse(socket, commandId, errorCode, params);
            break;
        default:
            if (errorCode === 1 && commandId === "rlu") return executeResponse(socket, commandId, 0, params);
            if (socket.debug) console.warn(`[RECEIVED ERROR] ${commandId}, ${errorCode}: ${getErrorText(errorCode)}: ${params.toString().substring(0, 100)}`);
            //todo: replace by processError
            executeResponse(socket, commandId, errorCode, params);
            break;
    }
}

/**
 * @param {Socket} socket
 * @param {string} commandId
 * @param {number} errorCode
 * @param {string[]} params
 */
function executeResponse(socket, commandId, errorCode, params) {
    const handler = commands[commandId.toLowerCase()];
    if (handler == null) {
        const _params = params.length === 0 ? "" : params[0].substring(0, 124 - commandId.length);
        if (socket.debug) console.warn(`[RECEIVED UNKNOWN COMMAND] ${commandId}: ${_params.trim()}`);
        return;
    }
    let _params = params;
    if (params.length === 1) {
        try {
            _params = JSON.parse(params[0]);
        } catch (e) {
            _params = params[0];
        }
    }
    handler.apply(this, [socket, errorCode, _params]);
}