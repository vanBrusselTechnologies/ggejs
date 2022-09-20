module.exports = {
    execute(socket, source, target, army, lord, horseWodId = -1) {
        let C2SCreateArmyAttackMovementVO = {
            params: {
                SX: source.position.X,
                SY: source.position.Y,
                TX: target.position.X,
                TY: target.position.Y,
                A: army,
                LID: lord.id,
                HBW: horseWodId,
                BPC: 0,
                ATT: 0,
                AV: 0,
                LP: 0,
                FC: 0,
                KID: source.kingdomId,
                PTT: 0,//pegasusTravelTicketsAmount,
                SD: 0,
                CD: 99,
                CB: 0,
                ICA: 0,
                CK: 0,
                BB: 0,
                SMK: 0,
                SPK: 0,
                BKS: [],
                AST: [],
            },
            getCmdId: "cra"
        }
        require('./../data').sendJsonVoSignal(socket, { "commandVO": C2SCreateArmyAttackMovementVO, "lockConditionVO": "new DefaultLockConditionVO()" });
    }
}