module.exports = {
    execute(socket, source, target, spyCount, spyTypeId, spyEffect, horse = null) {
        let C2SSendMessageVO = {
            params: {
                SID: source.objectId,
                TX: target.position.X,
                TY: target.position.Y,
                SC: spyCount,
                ST: spyTypeId,
                SE: spyEffect,
                HBW: horse?.wodId ?? -1,
                KID: source.kingdomId,
                PTT: horse?.isPegasusHorse ? 1 : 0,
                SD: 0,
            }, getCmdId: "csm"
        }
        require('./../data').sendJsonVoSignal(socket, {
            "commandVO": C2SSendMessageVO, "lockConditionVO": "new DefaultLockConditionVO()"
        });
    }
}