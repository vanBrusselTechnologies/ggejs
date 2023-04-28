module.exports = {
    name: "sie",
    execute(socket) {
        let C2SSubscriptionsInformationVO = {
            getCmdId: "sie",
            params: {},
        }
        require('./../data').sendJsonVoSignal(socket, {
            "commandVO": C2SSubscriptionsInformationVO,
            "lockConditionVO": null
        });
    }
}