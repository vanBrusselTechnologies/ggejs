module.exports = {
    execute(socket, source, target, spyCount, spyTypeId, spyEffect, horseWodId = -1) {
        let C2SSendMessageVO = {
            params: {
                SID: source.objectId,
                TX: target.position.X,
                TY: target.position.Y,
                SC: spyCount,
                ST: spyTypeId,
                SE: spyEffect,
                HBW: horseWodId,
                KID: source.kingdomId,
                PTT: 0,//pegasusTravelTicketsAmount,
                SD: 0,
            },
            getCmdId: "csm"
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SSendMessageVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}