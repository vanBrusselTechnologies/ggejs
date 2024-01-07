const path = require('node:path');
const fs = require('fs');
const {setRoomList, onJoinRoom, getRoom, autoJoinRoom} = require('./../../room.js');

let _hasAutoJoined = false;

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
 * @param {object} event
 */
module.exports.onResponse = function (socket, event) {
    /** @type Array */
    let params = event.dataObj;
    let command = params.shift();
    switch (command) {
        case "rlu":
            setRoomList(params);
            if (!_hasAutoJoined) {
                _hasAutoJoined = true;
                autoJoinRoom(socket);
            }
            return;
        case "jro":
            onJoinRoom(socket, {params: {"room": getRoom(parseInt(params.shift()))}});
            return;
        default:
            params.shift();
            let responseVO = {
                error: parseInt(params.shift()), commandID: command, paramArray: params,
            }
            executeResponse(socket, responseVO);
            return;
    }
}

/**
 * @param {Socket} socket
 * @param {object} _jsonResponseVO
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
                        console.log('Received multi param jsonResponseVO')
                        console.log(_jsonResponseVO)
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
            if (socket.debug) console.log('[RECEIVED UNKNOWN COMMAND] ' + _jsonResponseVO.commandID + ": " + _params.trim());
        }
    } catch (e) {
        if (socket.debug) {
            console.log("Error");
            console.log(_jsonResponseVO);
            console.log(e);
        }
    }
}