module.exports = {
    execute(socket, source, target, goods, horseWodId = -1) {
        let C2SSendMessageVO = {
            params: {
                SID: source.objectId,
                TX: target.position.X,
                TY: target.position.Y,
                G: goods,
                HBW: horseWodId,
                KID: source.kingdomId,
                PTT: 0,//pegasusTravelTicketsAmount,
                SD: 0,
            },
            getCmdId: "crm"
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SSendMessageVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}