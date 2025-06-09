module.exports.name = "core_rld";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{M:string, P:string}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    switch (errorCode - 10005) {
        case 0:
            require('../../commands/login').execute(socket, params.M, params.P);
            break;
        case 1:
            console.error("CoreErrorIdConstants.UNEXPECTED_ERROR");
            break;
        case 3:
            //worldIsFullSignal.dispatch();
            break;
        default:
            //showErrorDialog(errorCode,params);
    }
}