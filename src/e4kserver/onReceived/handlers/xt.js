const path = require('node:path');
const fs = require('fs');
const {setRoomList, onJoinRoom, getRoom, autoJoinRoom} = require('../../room.js');

let commands = [];
const commandPath = path.join(__dirname, '../xt');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    commands[command.name] = command.execute;
}

/**
 * @param {Socket} socket
 * @param {Object} event
 */
module.exports.onResponse = function (socket, event) {
    /** @type Array */
    let params = event.dataObj;
    let command = params.shift();
    switch (command) {
        case "rlu":
            //todo: RLU
            setRoomList(params);
            if (!socket["_hasAutoJoined"]) {
                socket["_hasAutoJoined"] = true;
                autoJoinRoom(socket);
            } else socket.client._verifyLoginData()
            return;
        case "jro":
            //todo: JRO
            onJoinRoom(socket, {params: {"room": getRoom(parseInt(params.shift()))}});
            return;
        default:
            params.shift();
            let responseVO = {
                error: parseInt(params.shift()), commandID: command, paramArray: params,
            }
            switch (responseVO.error) {
                case 0:
                case 10005:
                    executeResponse(socket, responseVO);
                    break;
                case 1:
                    if (socket.debug) console.warn(`${responseVO.commandID} GENERAL_ERROR ${responseVO.paramArray}`);
                    break;
                case 2:
                    if (socket.debug) console.warn(`${responseVO.commandID} INVALID_PARAMETER_VALUE ${responseVO.paramArray}`);
                    break;
                case 3:
                    if (socket.debug) console.warn(`${responseVO.commandID} MISSING_PARAMETER ${responseVO.paramArray}`);
                    break;
                default:
                    //todo: replace by processError, all ALL_OK responses are handled in errorcode 0 and 10005
                    if (socket.debug) console.warn(`[RECEIVED ERROR]: ${responseVO.commandID}, ${responseVO.error}: ${responseVO.paramArray.toString().substring(0, 100)}`);
                    executeResponse(socket, responseVO);
                    break;
            }
            return;
    }
}

/**
 * @param {Socket} socket
 * @param {Object} _jsonResponseVO
 */
function executeResponse(socket, _jsonResponseVO) {
    try {
        let cmd = _jsonResponseVO.commandID.toLowerCase();
        let handler = commands[cmd];
        if (handler != null) {
            let params;
            try {
                if (_jsonResponseVO.paramArray.length === 0) {
                    params = _jsonResponseVO.paramArray;
                } else if (_jsonResponseVO.paramArray.length === 1) {
                    try {
                        params = JSON.parse(_jsonResponseVO.paramArray[0]);
                    } catch (e) {
                        params = _jsonResponseVO.paramArray[0];
                    }
                } else {
                    params = _jsonResponseVO.paramArray;
                    if (socket.debug) {
                        console.warn('Received multi param jsonResponseVO', _jsonResponseVO)
                    }
                }
            } catch (e) {
                if (socket.debug) {
                    console.log(_jsonResponseVO)
                    console.error(e);
                }
                params = _jsonResponseVO.paramArray;
            }
            let error = _jsonResponseVO.error;
            handler.apply(this, [socket, error, params]);
        } else {
            const _params = _jsonResponseVO.paramArray.length === 0 ? "" : _jsonResponseVO.paramArray[0].substring(0, 124 - _jsonResponseVO.commandID.length);
            if (socket.debug) console.warn(`[RECEIVED UNKNOWN COMMAND] ${_jsonResponseVO.commandID}: ${_params.trim()}`);
        }
    } catch (e) {
        if (socket.debug) {
            console.error("Error", _jsonResponseVO, e);
        }
    }
}