module.exports = {
    name: "gbd",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        for (let x in params) {
            switch (x) {
                case "ahl":
                case "dql":
                case "gcu":
                case "gli":
                case "gpi":
                case "mpe":
                    require(`./${x}`).execute(socket, errorCode, params[x]);
                    break;
                case "gms":
                    socket.client["maxSpies"] = params.gms.MS;
                    break;
                default:
                    if (socket["debug"]) console.log("Unknown part in gbd command: " + x);
                    //if (socket["debug"]) console.log(params[x])
            }
        }
        /*setTimeout(()=>{
            let C2SSubscriptionsInformationVO = {
                getCmdId: "sie",
                params: {},
            }
            require('./../../data').sendJsonVoSignal(socket, {"commandVO": C2SSubscriptionsInformationVO, "lockConditionVO": null})
            let C2SShowRuinDataVO = {
                getCmdId: "grt",
                params: {},
            }
            require('./../../data').sendJsonVoSignal(socket, {"commandVO": C2SShowRuinDataVO, "lockConditionVO": null})
            let C2SGetLoginBonusVO = {
                getCmdId: "alb",
                params: {},
            }
            require('./../../data').sendJsonVoSignal(socket, {"commandVO": C2SGetLoginBonusVO, "lockConditionVO": null})
            let C2SStartupLoginBonusVO = {
                getCmdId: "sli",
                params: {},
            }
            require('./../../data').sendJsonVoSignal(socket, {"commandVO": C2SStartupLoginBonusVO, "lockConditionVO": null})
            let C2SShowMessagesVO = {
                getCmdId: "sne",
                params: {},
            }
            require('./../../data').sendJsonVoSignal(socket, {"commandVO": C2SShowMessagesVO, "lockConditionVO": null})
        }, 1000)*/
    }
}