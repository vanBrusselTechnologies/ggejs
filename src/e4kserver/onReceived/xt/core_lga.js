module.exports.name = "core_lga";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    //todo: Core_LGA has massive source code update
    switch (errorCode - 10005) {
        case 0:
            await require('../../connection.js').onLogin(socket);
            break;
        case 1:
            await require('../../connection.js').onLogin(socket);
            break;
        case 2:
            await require('../../connection.js').onLogin(socket, "AuthenticationProblem: Missing LoginData!");
            break;
        case 5:
            await require('../../connection.js').onLogin(socket, "AuthenticationProblem: User Not Found!");
            break;
        case 6:
            await require('../../connection.js').onLogin(socket, "AuthenticationProblem: Invalid Password!");
            break;
        case 7:
            await require('../../connection.js').onLogin(socket, "AuthenticationProblem: User Banned or Account Deleted!");
            break;
        case 11:
            await require('../../connection.js').onLogin(socket, "AuthenticationProblem: Invalid Language!");
            break;
        case 15:
            await require('../../connection.js').onLogin(socket, "AuthenticationProblem: User Kicked!");
            break;
        default:
            await require('../../connection.js').onLogin(socket, `ERROR ${errorCode}: ${JSON.stringify(params)}`);
            break;
    }
}