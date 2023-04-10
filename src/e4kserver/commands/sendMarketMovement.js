module.exports = {
    execute(socket, source, target, goods, horse) {
        let C2SSendMessageVO = {
            params: {
                SID: source.objectId,
                TX: target.position.X,
                TY: target.position.Y,
                G: goods,
                HBW: horse?.wodId ?? -1,
                KID: source.kingdomId,
                PTT: horse?.isPegasusHorse ? 1 : 0,
                SD: 0,
            },
            getCmdId: "crm"
        }
        require('./../data').sendJsonVoSignal(socket, {
            "commandVO": C2SSendMessageVO,
            "lockConditionVO": "new DefaultLockConditionVO()"
        });
    }
}