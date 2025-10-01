module.exports.name = "cra";
/**
 * @param {BaseClient} client
 * @param {InteractiveMapobject} source
 * @param {Mapobject | CastlePosition} target
 * @param {{L: {T: [number, number][], U: [number, number][]}, M: {T: [number, number][], U: [number, number][]}, R: {T: [number, number][], U: [number, number][]}}[]} army
 * @param {Lord} lord
 * @param {Horse} horse
 */
module.exports.execute = function (client, source, target, army, lord, horse = null) {
    const C2SCreateArmyAttackMovementVO = {
        SX: source.position.X,
        SY: source.position.Y,
        TX: target.position.X,
        TY: target.position.Y,
        A: army,
        LID: lord.id,
        HBW: horse?.wodId ?? -1,
        BPC: 0,
        ATT: 0,
        AV: 0,
        LP: 0,
        FC: 0,
        KID: source.kingdomId,
        PTT: horse?.isPegasusHorse ? 1 : 0,
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
        RW: [],
        ASCT: 0,
        AAC: 0,
        AASM: 0,
    };
    client.socketManager.sendCommand("cra", C2SCreateArmyAttackMovementVO);
}