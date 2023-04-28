module.exports = {
    name: "seq", execute(socket, equipmentId, lordId = -1, lostAndFoundRewardId = -1) {
        let C2SSellEquipmentVO = {
            getCmdId: "seq",
            params: {
                EID: equipmentId,
                LID: lordId,
                LFID: lostAndFoundRewardId,
            },
        }
        require('./../data').sendJsonVoSignal(socket, {"commandVO": C2SSellEquipmentVO, "lockConditionVO": null});
    }
}