const path = require('node:path');
const fs = require('node:fs');
const {getErrorText} = require("../utils/ErrorConst");
const {ConnectionStatus} = require("../utils/Constants");

/** @type {{[p: string]: function(Client, number, Object)}} */
const commands = {};
const commandPath = path.join(__dirname, './onReceived');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    if (file === "index.js") continue;
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    commands[command.name] = command.execute;
}
const commandFilesNew = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
for (const file of commandFilesNew) {
    if (file === "index.js") continue;
    const filePath = path.join(__dirname, file);
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
            // TODO: replace by processError
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
        const paramString = params.length === 0 ? "" : params[0].substring(0, 124 - commandId.length);
        client.logger.d(`[RECEIVED UNKNOWN COMMAND] ${commandId}: ${paramString.trim()}`);
        return;
    }
    let paramObj = {};
    if (params.length === 1) {
        try {
            paramObj = JSON.parse(params[0]);
        } catch (e) {
            paramObj = params[0];
        }
    }
    handler.apply(this, [client, errorCode, paramObj]);
}

/**
 * @param {any | void} data
 * @param {number} errorCode
 * @param {Object} params
 * @param {CommandCallback<*>[]} callbacks
 */
module.exports.baseExecuteCommand = function (data, errorCode, params, callbacks) {
    const success = errorCode === 0 || errorCode === 10005;
    if (callbacks.length === 0) return;
    const i = Math.max(success ? -1 : 0, callbacks.findIndex(c => c.match(params)));
    if (i === -1) return;
    const cb = callbacks.splice(i, 1)[0];
    if (!success) return cb.reject(errorCode);
    cb.resolve(data);
}

/**
 * @param {Client} client
 * @param {string} name
 * @param {Object} params
 * @param {CommandCallback<*>[]} callbacks
 * @param {(params: Object) => boolean} match
 * @returns {Promise<*>}
 */
module.exports.baseSendCommand = function (client, name, params, callbacks, match) {
    return new Promise((resolve, reject) => {
        const id = require('crypto').randomUUID();
        callbacks.push({id, match, resolve, reject});
        const success = client.socketManager.sendCommand(name, params);
        if (success !== true) return reject("Client disconnected!");
        setTimeout(() => {
            const i = callbacks.findIndex(c => c.id === id);
            if (i !== -1) callbacks.splice(i, 1);
            reject(client.socketManager.connectionStatus === ConnectionStatus.Disconnected ? "Client disconnected!" : "Exceeded max time!");
        }, 1000);
    });
}