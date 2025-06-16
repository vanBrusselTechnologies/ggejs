module.exports.name = "core_rld";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{M:string, P:string}} params
 */
module.exports.execute = function (client, errorCode, params) {
    switch (errorCode - 10005) {
        case 0:
            require('../../commands/login').execute(client, params.M, params.P);
            break;
        case 1:
            client.logger.e("[CORE_RLD] UNEXPECTED_ERROR");
            break;
        case 3:
            //worldIsFullSignal.dispatch();
            break;
        default:
            //showErrorDialog(errorCode,params);
    }
}