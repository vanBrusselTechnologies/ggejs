module.exports.name = "ato";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{ABT:string, ABTV2:string, ES:number, ZNID: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
        const apiTokenInfo = {}//new ApiTokenInfoVO();
        apiTokenInfo.token = params["ABT"];
        apiTokenInfo.tokenExpirationDate = new Date(Date.now() + params["ES"] * 1000);
        socket.client._apiToken = apiTokenInfo;
}