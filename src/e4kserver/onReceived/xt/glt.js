const {ServerType} = require("../../../utils/Constants");

module.exports = {
    name: "glt",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    async execute(socket, errorCode, params) {
        if (params == null) return;

        let LoginTokenServerInfoVO = {//LoginTokenServerInfoVO
            token: params["TLT"],
            ip: params["TSIP"],
            port: params["TSP"],
            zone: params["TSZ"],
            zoneId: params["ZID"],
            instanceId: params["IID"]
        }

        let C2SRegisterOrLoginVO = {
            params: {
                GST: ServerType.TempServer,//ServerType.TempServer, //ServerType.AllianceBattleGround
                TLT: LoginTokenServerInfoVO.token,
                ADID: "null",
                AFUID: "",
                IDFV: null,
            },
            getCmdId: 'tle',
        }
        require('../../data').sendJsonVoSignal(socket, {
            "commandVO": C2SRegisterOrLoginVO,
            "lockConditionVO": null
        });
        socket.client["_serverInstance2"] = LoginTokenServerInfoVO;
    }
}