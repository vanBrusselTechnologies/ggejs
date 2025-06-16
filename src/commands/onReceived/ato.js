module.exports.name = "ato";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{ABT:string, ABTV2:string, ES:number, ZNID: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
        const apiTokenInfo = {}//new ApiTokenInfoVO();
        apiTokenInfo.token = params["ABT"];
        apiTokenInfo.tokenExpirationDate = new Date(Date.now() + params["ES"] * 1000);
        client._apiToken = apiTokenInfo;
}