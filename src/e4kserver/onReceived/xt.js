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
 * @param {Client} client
 * @param {string[]} params
 */
module.exports.onResponse = function (client, params) {
    const commandId = params.shift();
    params.shift();
    const errorCode = parseInt(params.shift());
    switch (errorCode) {
        case 0:
        case 10005:
            executeResponse(client, commandId, errorCode, params);
            break;
        default:
            if (errorCode === 1 && commandId === "rlu") return executeResponse(client, commandId, 0, params);
            client.logger.d(`[RECEIVED ERROR] ${commandId}, ${errorCode}: ${getErrorText(errorCode)}: ${params.toString().substring(0, 100)}`);
            //todo: replace by processError
            executeResponse(client, commandId, errorCode, params);
            break;
    }
}

/**
 * @param {Client} client
 * @param {string} commandId
 * @param {number} errorCode
 * @param {string[]} params
 */
function executeResponse(client, commandId, errorCode, params) {
    const handler = commands[commandId.toLowerCase()];
    if (handler == null) {
        const _params = params.length === 0 ? "" : params[0].substring(0, 124 - commandId.length);
        client.logger.d(`[RECEIVED UNKNOWN COMMAND] ${commandId}: ${_params.trim()}`);
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
    handler.apply(this, [client, errorCode, _params]);
}