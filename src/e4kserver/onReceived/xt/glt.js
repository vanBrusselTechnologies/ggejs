module.exports.name = "glt";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    if (params == null) return;
    let LoginTokenServerInfoVO = {//LoginTokenServerInfoVO
        token: params["TLT"],
        ip: params["TSIP"],
        port: params["TSP"],
        zone: params["TSZ"],
        zoneId: params["ZID"],
        instanceId: params["IID"]
    }
    LoginTokenServerInfoVO["server"] = LoginTokenServerInfoVO.ip;
    socket["serverLoginTokenServerInfo"] = LoginTokenServerInfoVO;
    console.log(LoginTokenServerInfoVO);
    let C2SRegisterOrLoginVO = {
        params: {
            GST: socket["activeExternalServerType"],
            TLT: LoginTokenServerInfoVO.token,
            ADID: "null",
            AFUID: "",
            IDFV: null,
        }, getCmdId: 'tle',
    }
    require('../../data').sendJsonVoSignal(socket, {
        "commandVO": C2SRegisterOrLoginVO, "lockConditionVO": null
    });
}