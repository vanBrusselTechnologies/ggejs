module.exports = {
    name: "aha", execute: function (socket) {
        let C2SAllianceHelpAllVO = {
            getCmdId: "aha",
            params: {
                KID: 15,
            },
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SAllianceHelpAllVO, "lockConditionVO": null});
    }
}