const {buildings, dailyactivities: dailyActivities} = require('e4k-data').data;
const {execute:mercenaryPackageCommand} = require('../../commands/mercenaryPackage');
const Horse = require('../../../structures/Horse');
const MovementManager = require('../../../managers/MovementManager');
const {HorseType, WorldmapArea, SpyType} = require("../../../utils/Constants");
const CombatConst = require('../../../utils/CombatConst');

module.exports.name = "dql";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{PQL: number, RDQ:{QID:number, P:[number]}[], FDQ: number[], RS: [string,number|number[]][][]}} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    if (!params) return;
    /** @type {Client} */
    const client = socket.client;
    try {
        /** @type {Player} */
        const thisPlayer = await client.players.getThisPlayer();
        if (!thisPlayer) return await require('./dql').execute(socket, errorCode, params);
        /** @type {CastleMapobject} */
        const myMainCastle = thisPlayer.castles.find(x => x.areaType === WorldmapArea.MainCastle);
        for (let i in params.RDQ) {
            const quest = params.RDQ[i];
            for (let dailyActivity of dailyActivities) {
                if (dailyActivity.dailyQuestID === quest?.QID) {
                    switch (quest.QID) {
                        case 1:
                            try {
                                socket["dailySpyAt"] = -1;
                                socket["dailySabotageAt"] = -1;
                                socket["dailyGoodsTravelTryCount"] = 0;
                                await client.__x__x__relogin();
                            } catch (e) {
                                if (socket.debug) console.log(e);
                            }
                            break; //login;
                        case 2:
                            try {
                                /** @type {Castle} */
                                const mainCastleInfo = await client.getCastleInfo(myMainCastle);
                                const dungeon = await getClosestDungeon(client, myMainCastle, false);
                                let horse = new Horse(client, mainCastleInfo, HorseType.Ruby_1);
                                client.movements.startSpyMovement(myMainCastle, dungeon, 1, SpyType.Military, 50, horse);
                            } catch (e) {
                                if (socket.debug) console.log(e);
                            }
                            break; //spendC2
                        case 3:
                            break; //collectTax
                        case 4:
                            try {
                                if (!socket["dailyGoodsTravelTryCount"]) socket["dailyGoodsTravelTryCount"] = 0;
                                /** @type {[string, number][]} */
                                const goods = [["W", 1], ["S", 1], ["F", 1]];
                                /** @type {WorldmapSector} */
                                let sector = await client.worldmaps.getSector(myMainCastle.kingdomId, myMainCastle.position.X, myMainCastle.position.Y);
                                /** @type {WorldmapOwnerInfo[]} */
                                let nonRuins = sector.mapobjects.map(o => o.ownerInfo).filter(x => x !== undefined && !x.isRuin && x.playerId !== thisPlayer.playerId && x.playerId >= 0);
                                nonRuins.sort((a, b) => {
                                    let distanceA = 10000;
                                    for (let castlePosition of a.castlePosList) {
                                        if (castlePosition.areaType !== 1 && castlePosition.areaType !== 4) continue;
                                        let castleDistance = MovementManager.getDistance(myMainCastle, castlePosition);
                                        distanceA = Math.min(distanceA, castleDistance)
                                    }
                                    let distanceB = 10000;
                                    for (let castlePosition of b.castlePosList) {
                                        if (castlePosition.areaType !== 1 && castlePosition.areaType !== 4) continue;
                                        let castleDistance = MovementManager.getDistance(myMainCastle, castlePosition);
                                        distanceB = Math.min(distanceB, castleDistance)
                                    }
                                    return distanceA - distanceB;
                                })
                                const _targetCastles = nonRuins[socket["dailyGoodsTravelTryCount"]]?.castlePosList;
                                nonRuins = null;
                                if (_targetCastles == null) break;
                                let _targetArea = _targetCastles[0];
                                let _targetAreaDistance = 1000000;
                                for (let k in _targetCastles) {
                                    let __castle = _targetCastles[k];
                                    if (__castle.areaType !== 1 && __castle.areaType !== 4) continue;
                                    let castleDistance = MovementManager.getDistance(myMainCastle, __castle);
                                    if (castleDistance < _targetAreaDistance) {
                                        _targetAreaDistance = castleDistance;
                                        _targetArea = __castle;
                                    }
                                }
                                client.movements.startMarketMovement(myMainCastle, _targetArea, goods);
                                socket["dailyGoodsTravelTryCount"] += 1;
                            } catch (e) {
                                if (socket.debug) console.log(e);
                            }
                            break; //resourceToPlayer
                        case 5:
                            try {
                                if (socket["dailySpyAt"] !== quest.P || socket["dailySpyTime"] + 1800000 < Date.now()) {
                                    const dungeon = await getClosestDungeon(client, myMainCastle, false);
                                    client.movements.startSpyMovement(myMainCastle, dungeon, Math.round(client.clientUserData.maxSpies / 4), SpyType.Military, 50);
                                    socket["dailySpyAt"] = quest.P;
                                    socket["dailySpyTime"] = Date.now();
                                }
                            } catch (e) {
                                if (socket.debug) console.log(e);
                            }
                            break; //spy
                        case 6:
                            try {
                                if (socket["inDQL_q6"]) return;
                                socket["inDQL_q6"] = true;
                                let ClassicMap = await client.worldmaps.get(0);
                                const closestRuinsOutpost = await getClosestRuinsOutpost(client, ClassicMap, myMainCastle);
                                ClassicMap = null;
                                if (socket["dailySabotageAt"] !== quest.P || socket["dailySabotageTime"] + 1800000 < Date.now()) {
                                    client.movements.startSpyMovement(myMainCastle, closestRuinsOutpost, Math.round(client.clientUserData.maxSpies / 4), SpyType.Sabotage, 10);
                                    socket["dailySabotageAt"] = quest.P;
                                    socket["dailySabotageTime"] = Date.now();
                                }
                                delete socket["inDQL_q6"];
                            } catch (e) {
                                delete socket["inDQL_q6"];
                                if (socket.debug) console.log(e);
                            }
                            break; //sabotageDamage
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                            try {
                                let myCastle = dailyActivity.triggerKingdomID === 0 ? myMainCastle : thisPlayer.castles.find(x => x.kingdomId === dailyActivity.triggerKingdomID && x.areaType === WorldmapArea.KingdomCastle);
                                if (myCastle == null) break;
                                let lord = socket.client.equipments.getAvailableCommandants()[0];
                                if (lord == null) break;
                                await attackDungeon(client, socket, thisPlayer, myCastle, lord);
                                await new Promise(resolve => setTimeout(resolve, 5000)); //Wait for the attack to be registered to avoid duplicate commander requests.
                            } catch (e) {
                                if (socket.debug && false) console.log(e);
                            }
                            break; //countDungeons
                        case 13:
                            break; //craftEquipment todo
                        case 14:
                            client.sendChatMessage(" ");
                            break; //writeInAllianceChat
                        case 15:
                            break; //collectFromCitizen, handled by IRC
                        case 16:
                            break; //recruitUnits todo
                        case 17:
                            break; //produceTools todo
                        case 21:
                            break; //requestAllianceHelp todo
                        case 22:
                            mercenaryPackageCommand(socket, -1);
                            break; //completeMercenaryMission
                        case 24:
                            try {
                                let lord = socket.client.equipments.getAvailableCommandants()[0];
                                if (lord == null) break;
                                await attackDungeon(client, socket, thisPlayer, myMainCastle, lord);
                                await new Promise(resolve => setTimeout(resolve, 5000)); //Wait for the attack to be registered to avoid duplicate commander requests.
                            } catch (e) {
                                if (socket.debug && false) console.log(e);
                            }
                            break; //countDungeons tempServer
                        case 25:
                            break; //countBattles 10 tempServer todo
                        case 26:
                            break; //countBattles 15 tempServer todo
                        default:
                            console.log("Unknown Daily Activity Quest!", quest);
                    }
                    break;
                }
            }
        }
    } catch (e) {
        if (socket.debug) console.log(e);
    }
}


/**
 *
 * @param {Client} client
 * @param {Worldmap} ClassicMap
 * @param {CastleMapobject} myMainCastle
 * @returns {Promise<CastleMapobject>}
 */
function getClosestRuinsOutpost(client, ClassicMap, myMainCastle) {
    return new Promise(async (resolve, reject) => {
        try {
            /** @type {CastleMapobject[]}*/
            let ruinedPlayerOutposts = ClassicMap.mapobjects.filter(x => {
                if(x.areaType !== WorldmapArea.Outpost) return false;
                const owner = x.ownerInfo;
                return owner.isRuin && !owner.isInAlliance;
            })
            ClassicMap = null;
            ruinedPlayerOutposts.sort((a, b) => {
                let distanceA = MovementManager.getDistance(myMainCastle, a);
                let distanceB = MovementManager.getDistance(myMainCastle, b);
                return distanceA - distanceB;
            })
            if (ruinedPlayerOutposts.length === 0) reject("No target found!");
            resolve(ruinedPlayerOutposts[0]);
        } catch (e) {
            reject(e);
        }
    })
}

/**
 *
 * @param {Client} client
 * @param {CastleMapobject} castle
 * @param {boolean} attackable
 * @returns {Promise<DungeonMapobject>}
 */
function getClosestDungeon(client, castle, attackable = true) {
    return new Promise(async (resolve, reject) => {
        try {
            /** @type {WorldmapSector} */
            let sector = await client.worldmaps.getSector(castle.kingdomId, castle.position.X, castle.position.Y);
            /** @type {DungeonMapobject[]} */
            let dungeons = sector.mapobjects.filter(x => x.areaType === WorldmapArea.Dungeon && (!attackable || !x.attackCooldownEnd) && (x.attackCount >= 1 || MovementManager.getDistance(x, castle) <= 12.5));
            sector = null;
            dungeons.sort((a, b) => {
                let distanceA = MovementManager.getDistance(castle, a);
                let distanceB = MovementManager.getDistance(castle, b);
                return distanceA - distanceB;
            })
            if (attackable) {
                /** @type {Movement[]} */
                const movements = client.movements.get();
                while (true) {
                    if (dungeons.length === 0) reject("No attackable dungeon found!");
                    const __mov = movements.find(x => x.targetArea?.kingdomId === dungeons[0].kingdomId && x.targetArea.position.toString() === dungeons[0].position.toString());
                    if (__mov == null) break; else dungeons.shift();
                }
            }
            let targetDungeon = dungeons[0];
            dungeons = null;
            if (MovementManager.getDistance(castle, targetDungeon) > 50) reject("Target too far away");
            resolve(targetDungeon);
        } catch (e) {
            reject(e);
        }
    })
}

/**
 *
 * @param {DungeonMapobject} dungeon
 * @returns {{middle: {moat: number, gate: number, wall: number}, left: {moat: number, wall: number}, right: {moat: number, wall: number}}}
 */
function getDungeonProtection(dungeon) {
    let protection = {
        left: {
            wall: 0, moat: 0,
        }, middle: {
            wall: 0, gate: 0, moat: 0,
        }, right: {
            wall: 0, moat: 0,
        }
    }
    let dungeonWallBaseProtection = 0;
    let dungeonGateBaseProtection = 0;
    for (let b of buildings) {
        if (b.wodID === dungeon.wallWodId) {
            dungeonWallBaseProtection = b.wallBonus;
            if (dungeonGateBaseProtection !== 0) break;
        }
        if (b.wodID === dungeon.gateWodId) {
            dungeonGateBaseProtection = b.gateBonus;
            if (dungeonWallBaseProtection !== 0) break;
        }
    }
    protection.middle.gate = dungeonGateBaseProtection;
    for (let k in protection) {
        protection[k].wall = dungeonWallBaseProtection;
    }
    for (let __effect of dungeon.lord.effects) {
        if (__effect.name === "gateBonus") {
            protection.middle.gate += __effect.power;
        } else if (__effect.name === "wallBonus") {
            protection.left.wall += __effect.power;
            protection.middle.wall += __effect.power;
            protection.right.wall += __effect.power;
        }
    }
    for (let k in dungeon.defence.tools) {
        for (let /** @type {InventoryItem<Tool>}*/t of dungeon.defence.tools[k]) {
            const unitData = t.item.rawData;
            if (unitData.typ === "Defence") {
                if (unitData.wallBonus) protection[k].wall += unitData.wallBonus; else if (unitData.gateBonus) protection[k].gate += unitData.gateBonus; else if (unitData.moatBonus) protection[k].moat += unitData.moatBonus;
            }
        }
    }
    return protection;
}

/**
 *
 * @param {DungeonMapobject} dungeon
 * @param {{left:{wall:number, moat:number}, middle:{wall:number, gate:number, moat:number}, right:{wall:number, moat:number}}} protection
 * @param {{left:{wall:number, moat:number}, middle:{wall:number, gate:number, moat:number}, right:{wall:number, moat:number}}} attackLowerProtection
 * @param {{ left: InventoryItem<Tool>[], middle: InventoryItem<Tool>[], right: InventoryItem<Tool>[] }} usedTools
 * @returns {{middle: {range: number, melee: number}, left: {range: number, melee: number}, center: {range: number, melee: number}, right: {range: number, melee: number}}}
 */
function getDungeonDefenceStrength(dungeon, protection, attackLowerProtection, usedTools) {
    let meleeDefenceStrength = {
        left: {
            melee: 0, range: 0,
        }, middle: {
            melee: 0, range: 0,
        }, right: {
            melee: 0, range: 0,
        }, center: {
            melee: 0, range: 0,
        }
    }
    let rangeDefenceStrength = {
        left: {
            melee: 0, range: 0,
        }, middle: {
            melee: 0, range: 0,
        }, right: {
            melee: 0, range: 0,
        }, center: {
            melee: 0, range: 0,
        }
    }
    for (let k in dungeon.defence.troops) {
        for (const /** @type {InventoryItem<Unit>} */ u of dungeon.defence.troops[k]) {
            /** @type {Unit} */
            const unit = u.item;
            /** @type {number} */
            const count = u.count;
            if (unit.rangeDefence > unit.meleeDefence) {
                rangeDefenceStrength[k].range += unit.rangeDefence * count;
                rangeDefenceStrength[k].melee += unit.meleeDefence * count;
                continue;
            }
            meleeDefenceStrength[k].range += unit.rangeDefence * count;
            meleeDefenceStrength[k].melee += unit.meleeDefence * count;
        }
    }
    let defenceStrengthBonus = {
        left: {
            melee: 0, range: 0,
        }, middle: {
            melee: 0, range: 0,
        }, right: {
            melee: 0, range: 0,
        }, center: {
            melee: 0, range: 0,
        }
    }
    for (let __effect of dungeon.lord.effects) {
        if (__effect.name === "meleeBonus") {
            defenceStrengthBonus.left.melee += __effect.power;
            defenceStrengthBonus.middle.melee += __effect.power;
            defenceStrengthBonus.right.melee += __effect.power;
            defenceStrengthBonus.center.melee += __effect.power;
            continue;
        }
        if (__effect.name === "rangeBonus") {
            defenceStrengthBonus.left.range += __effect.power;
            defenceStrengthBonus.middle.range += __effect.power;
            defenceStrengthBonus.right.range += __effect.power;
            defenceStrengthBonus.center.range += __effect.power;
        }
    }
    for (let k in dungeon.defence.tools) {
        for (/** @type {InventoryItem<Tool>}*/const t of dungeon.defence.tools[k]) {
            /** @type {Unit} */
            const unit = t.item;
            if (unit.fightType === 1) {
                if (unit.meleeBonus) defenceStrengthBonus[k].melee += unit.meleeBonus; else if (unit.rangeBonus) defenceStrengthBonus[k].range += unit.rangeBonus;
            }
        }
    }
    for (let k in usedTools) {
        for (/** @type {InventoryItem<Tool>} */const toolAndCount of usedTools[k]) {
            /** @type {Unit} */
            const tool = toolAndCount.item;
            if (tool.fightType === 0) {
                if (tool.defRangeBonus) defenceStrengthBonus[k].range -= tool.defRangeBonus * toolAndCount.count;
            }
        }
    }
    for (let i in attackLowerProtection) {
        for (let j in attackLowerProtection[i]) {
            protection[i][j] -= attackLowerProtection[i][j];
        }
    }
    let defenceBonusWGM = {
        left: (1 + Math.max(0, protection.left.wall / 100)) * (1 + Math.max(0, protection.left.moat / 100)) - 1,
        middle: (1 + Math.max(0, protection.middle.wall / 100)) * (1 + Math.max(0, protection.middle.gate / 100)) * (1 + Math.max(0, protection.middle.moat / 100)) - 1,
        right: (1 + Math.max(0, protection.right.wall / 100)) * (1 + Math.max(0, protection.right.moat / 100)) - 1,
    }
    let totalDefenceBonus = {
        left: {
            melee: (1 + defenceBonusWGM.left) * (1 + defenceStrengthBonus.left.melee / 100),
            range: (1 + defenceBonusWGM.left) * (1 + defenceStrengthBonus.left.range / 100),
        }, middle: {
            melee: (1 + defenceBonusWGM.middle) * (1 + defenceStrengthBonus.middle.melee / 100),
            range: (1 + defenceBonusWGM.middle) * (1 + defenceStrengthBonus.middle.range / 100),
        }, right: {
            melee: (1 + defenceBonusWGM.right) * (1 + defenceStrengthBonus.right.melee / 100),
            range: (1 + defenceBonusWGM.right) * (1 + defenceStrengthBonus.right.range / 100),
        }, center: {
            melee: 1 + defenceStrengthBonus.center.melee / 100, range: 1 + defenceStrengthBonus.center.range / 100,
        }
    }
    let defenceStrengthTotal = {
        left: {
            melee: 0, range: 0,
        }, middle: {
            melee: 0, range: 0,
        }, right: {
            melee: 0, range: 0,
        }, center: {
            melee: 0, range: 0,
        }
    }
    for (let k in defenceStrengthTotal) {
        for (let l in defenceStrengthTotal[k]) {
            defenceStrengthTotal[k][l] = meleeDefenceStrength[k][l] * totalDefenceBonus[k].melee + rangeDefenceStrength[k][l] * totalDefenceBonus[k].range;
        }
    }
    return defenceStrengthTotal;
}

/**
 * @param {DungeonMapobject} dungeon
 * @param {Lord} general
 * @param {{left:{wall:number, moat:number}, middle:{wall:number, gate:number, moat:number}, right:{wall:number, moat:number}}} dungeonProtection
 * @param {InventoryItem<Tool>[]} availableTools
 * @returns {{attackLowerProtection:{ left: { wall: number, moat: number }, middle: { wall: number, gate: number, moat: number }, right: { wall: number, moat: number } }, usedTools: { left: InventoryItem<Tool>[], middle: InventoryItem<Tool>[], right: InventoryItem<Tool>[] }}}
 */
function getAttackLowerProtectionDungeon(dungeon, general, dungeonProtection, availableTools) {
    let attackLowerProtection = {
        left: {
            wall: 0, moat: 0,
        }, middle: {
            wall: 0, gate: 0, moat: 0,
        }, right: {
            wall: 0, moat: 0,
        }
    }
    for (let i in general.effects) {
        let effect = general.effects[i];
        if (effect.name === "wallReduction" || effect.name === "wallReductionPVE" || effect.name === "relicWallReduction" || effect.name === "relicWallReductionPVE") {
            attackLowerProtection.left.wall += effect.power;
            attackLowerProtection.middle.wall += effect.power;
            attackLowerProtection.right.wall += effect.power;
        }
        if (effect.name === "gateReduction" || effect.name === "gateReductionPVE" || effect.name === "relicGateReduction" || effect.name === "relicGateReductionPVE") {
            attackLowerProtection.middle.gate += effect.power;
        }
        if (effect.name === "moatReduction" || effect.name === "moatReductionPVE" || effect.name === "relicMoatReduction" || effect.name === "relicMoatReductionPVE") {
            attackLowerProtection.left.moat += effect.power;
            attackLowerProtection.middle.moat += effect.power;
            attackLowerProtection.right.moat += effect.power;
        }
    }
    let restProtection = {
        left: {
            wall: 0, moat: 0,
        }, middle: {
            wall: 0, gate: 0, moat: 0,
        }, right: {
            wall: 0, moat: 0,
        }
    }
    for (let i in restProtection) {
        for (let j in restProtection[i]) {
            restProtection[i][j] = dungeonProtection[i][j] - attackLowerProtection[i][j];
        }
    }
    /**
     *
     * @type {{middle: InventoryItem<Tool>[], left: InventoryItem<Tool>[], right: InventoryItem<Tool>[]}}
     */
    let usedTools = {
        left: [], middle: [], right: []
    };
    let availableToolBoxesFlank = CombatConst.getToolSlotCountFlank(dungeon.level);
    let availableToolBoxesMiddle = CombatConst.getToolSlotCountFront(dungeon.level);
    let maxToolAmountFlank = CombatConst.getTotalAmountToolsFlank(dungeon.level);
    let maxToolAmountMiddle = CombatConst.getTotalAmountToolsMiddle(dungeon.level);
    let lordRangeDefenceBonus = 0;
    for (let k in dungeon.lord.effects) {
        let __effect = dungeon.lord.effects[k];
        if (__effect.name === "rangeBonus") {
            lordRangeDefenceBonus += __effect.power;
        }
    }
    for (let i in restProtection) {
        let sideIsMiddle = i === "middle"
        let toolsUsedOnSide = 0;
        let maxToolCountOnSide = sideIsMiddle ? maxToolAmountMiddle : maxToolAmountFlank;
        let availableToolBoxes = sideIsMiddle ? availableToolBoxesMiddle : availableToolBoxesFlank;
        if (availableToolBoxes >= 2) {
            for (let j in restProtection[i]) {
                if (restProtection[i][j] > 0) {
                    for (let k in availableTools) {
                        let _tool = availableTools[k].item;
                        const _toolData = _tool.rawData;
                        if (_toolData[`${j}Bonus`]) {
                            if (restProtection[i][j] / _toolData[`${j}Bonus`] < availableTools[k].count) {
                                let __foundTool = false;
                                let _toolUseCount = Math.min(Math.ceil(restProtection[i][j] / _toolData[`${j}Bonus`]), maxToolCountOnSide - toolsUsedOnSide);
                                for (let l in usedTools[i]) {
                                    if (usedTools[i][l].item.wodId === _tool.wodId) {
                                        __foundTool = true;
                                        toolsUsedOnSide += _toolUseCount;
                                        usedTools[i][l].count += _toolUseCount;
                                        availableTools[k].count -= _toolUseCount;
                                        restProtection[i][j] -= _toolUseCount * _toolData[`${j}Bonus`];
                                        attackLowerProtection[i][j] += _toolUseCount * _toolData[`${j}Bonus`];
                                        break;
                                    }
                                }
                                if (!__foundTool) {
                                    usedTools[i].push({item: _tool, count: _toolUseCount});
                                    toolsUsedOnSide += _toolUseCount;
                                    availableTools[k].count -= _toolUseCount;
                                    restProtection[i][j] -= _toolUseCount * _toolData[`${j}Bonus`];
                                    attackLowerProtection[i][j] += _toolUseCount * _toolData[`${j}Bonus`];
                                }
                                break;
                            }
                        }
                    }
                }
            }
            if (availableToolBoxes > usedTools[i].length) {
                let _rangeDefenders = dungeon.defence.troops[i].filter(x => x.item.rangeAttack > 0);
                if (_rangeDefenders.length > 0) {
                    let availableShields = availableTools.filter(x => x.item.rawData.defRangeBonus != null);
                    if (availableShields.length > 0) {
                        let _tool = availableShields[0].item;
                        let _toolUseCount = Math.ceil((100 + lordRangeDefenceBonus) / _tool.rawData.defRangeBonus);
                        _toolUseCount = Math.min(availableShields[0].count, _toolUseCount, maxToolCountOnSide - toolsUsedOnSide);
                        if (_toolUseCount > 0) {
                            usedTools[i].push({item: _tool, count: _toolUseCount});
                            availableShields[0].count -= _toolUseCount;
                        }
                    }
                }
            }
        }
        if (availableToolBoxes === 1) {
            let highestProtectionType = "";
            let highestProtectionValue = 0;
            for (let k in restProtection[i]) {
                if (restProtection[i][k] > highestProtectionValue) {
                    highestProtectionType = k;
                }
            }
            let j = highestProtectionType;
            if (restProtection[i][j] > 0) {
                for (let k in availableTools) {
                    let _tool = availableTools[k].item;
                    const _toolData = _tool.rawData;
                    if (_toolData[`${j}Bonus`]) {
                        if (restProtection[i][j] / _toolData[`${j}Bonus`] < availableTools[k].count) {
                            let __foundTool = false;
                            let _toolUseCount = Math.min(Math.ceil(restProtection[i][j] / _toolData[`${j}Bonus`]), maxToolCountOnSide - toolsUsedOnSide);
                            for (let l in usedTools[i]) {
                                if (usedTools[i][l].item.wodId === _tool.wodId) {
                                    __foundTool = true;
                                    toolsUsedOnSide += _toolUseCount;
                                    usedTools[i][l].count += _toolUseCount;
                                    availableTools[k].count -= _toolUseCount;
                                    restProtection[i][j] -= _toolUseCount * _toolData[`${j}Bonus`];
                                    attackLowerProtection[i][j] += _toolUseCount * _toolData[`${j}Bonus`];
                                    break;
                                }
                            }
                            if (!__foundTool) {
                                usedTools[i].push({item: _tool, count: _toolUseCount});
                                toolsUsedOnSide += _toolUseCount;
                                availableTools[k].count -= _toolUseCount;
                                restProtection[i][j] -= _toolUseCount * _toolData[`${j}Bonus`];
                                attackLowerProtection[i][j] += _toolUseCount * _toolData[`${j}Bonus`];
                            }
                            break;
                        }
                    }
                }
            } else {
                let _rangeDefenders = dungeon.defence.troops[i].filter(x => x.item.rangeAttack > 0);
                if (_rangeDefenders.length > 0) {
                    let availableShields = availableTools.filter(x => x.item.rawData.defRangeBonus != null);
                    if (availableShields.length > 0) {
                        let _tool = availableShields[0].item;
                        let _toolUseCount = Math.ceil((100 + lordRangeDefenceBonus) / _tool.rawData.defRangeBonus);
                        _toolUseCount = Math.min(availableShields[0].count, _toolUseCount, maxToolCountOnSide - toolsUsedOnSide);
                        if (_toolUseCount > 0) {
                            usedTools[i].push({item: _tool, count: _toolUseCount});
                            availableShields[0].count -= _toolUseCount;
                        }
                    }
                }
            }
        }
    }
    return {attackLowerProtection, usedTools};
}

/**
 *
 * @param {Player} player
 * @param {DungeonMapobject} dungeon
 * @param {{ left: { melee: number, range: number }, middle: { melee: number, range: number }, right: { melee: number, range: number }, center: { melee: number, range: number } }} defenceStrength
 * @param {InventoryItem<Unit>[]} availableSoldiers
 * @param {Lord} lord
 * @param {{ left: InventoryItem<Tool>[], middle: InventoryItem<Tool>[], right: InventoryItem<Tool>[] }} usedTools
 * @param {InventoryItem<Tool>[]} availableTools
 * @returns {ArmyWave[]}
 */
function getBestArmyForDungeon(player, dungeon, defenceStrength, availableSoldiers, lord, usedTools, availableTools) {
    let attackStrength = 0;
    let meleeStrength = 0;
    let rangeStrength = 0;
    for (let soldier of availableSoldiers) {
        let unit = soldier.item;
        let count = soldier.count;
        if (unit.rangeAttack) {
            rangeStrength += unit.rangeAttack * count;
            attackStrength += rangeStrength;
        }
        if (unit.meleeAttack) {
            meleeStrength += unit.meleeAttack * count;
            attackStrength += meleeStrength;
        }
    }
    let _defenceStrengthTotal = 0;
    for (let ___side in defenceStrength) {
        for (let ___type in defenceStrength[___side]) {
            _defenceStrengthTotal += defenceStrength[___side][___type];
        }
    }
    if (_defenceStrengthTotal > attackStrength) return [];
    let lordMeleeBonus = 0;
    let lordRangeBonus = 0;
    let frontAttackBonus = 0;
    let flankAttackBonus = 0;
    let frontUnitAmountBonus = 0;
    let flankUnitAmountBonus = 0;
    let additionalWaves = 0;
    for (let _effect of lord.effects) {
        if (_effect.name === "meleeBonus" || _effect.name === "offensiveMeleeBonus" || _effect.name === "offensiveMeleeBonusPVE" || _effect.name === "relicOffensiveMeleeBonus" || _effect.name === "relicOffensiveMeleeBonusPVE" || _effect.name === "relicMeleeBonus" || _effect.name === "relicMeleeBonusPvE") {
            lordMeleeBonus += _effect.power / 100;
        } else if (_effect.name === "offensiveMeleeMalusPVE") {
            lordMeleeBonus -= Math.abs(_effect.power) / 100;
        } else if (_effect.name === "rangeBonus" || _effect.name === "offensiveRangeBonus" || _effect.name === "offensiveRangeBonusPVE" || _effect.name === "relicOffensiveRangeBonus" || _effect.name === "relicOffensiveRangeBonusPVE" || _effect.name === "relicRangeBonus" || _effect.name === "relicRangeBonusPvE") {
            lordRangeBonus += _effect.power / 100;
        } else if (_effect.name === "offensiveRangeMalusPVE") {
            lordRangeBonus -= Math.abs(_effect.power) / 100;
        } else if (_effect.name === "AttackBoostFront" || _effect.name === "AttackBoostFront2" || _effect.name === "relicAttackBoostFront") {
            frontAttackBonus += _effect.power / 100;
        } else if (_effect.name === "AttackBoostFlank" || _effect.name === "AttackBoostFlank2" || _effect.name === "relicAttackBoostFlank") {
            flankAttackBonus += _effect.power / 100;
        } else if (_effect.name === "AttackUnitAmountFront" || _effect.name === "attackUnitAmountFrontPVE" || _effect.name === "relicAttackUnitAmountFront" || _effect.name === "relicAttackUnitAmountFrontPVE") {
            frontUnitAmountBonus += _effect.power;
        } else if (_effect.name === "attackUnitAmountFrontMalusPVE") {
            frontUnitAmountBonus -= Math.abs(_effect.power);
        } else if (_effect.name === "attackUnitAmountFlank" || _effect.name === "attackUnitAmountFlankPVE" || _effect.name === "relicAttackUnitAmountFlank" || _effect.name === "relicAttackUnitAmountFlankPVE") {
            flankUnitAmountBonus += _effect.power;
        } else if (_effect.name === "attackUnitAmountFlankMalusPVE") {
            flankUnitAmountBonus -= Math.abs(_effect.power);
        } else if (_effect.name === "additionalWaves" || _effect.name === "relicAdditionalWaves") {
            additionalWaves += _effect.power;
        }
    }
    let meleeSoldiersSorted = availableSoldiers.filter(x => x.item.meleeAttack !== undefined);
    let rangeSoldiersSorted = availableSoldiers.filter(x => x.item.rangeAttack !== undefined);
    /** @type {ArmyWave[]} */
    const army = [];
    let waveCount = CombatConst.getMaxWaveCountWithBonus(player.playerLevel, false, additionalWaves);
    for (let w = 0; w < waveCount; w++) {
        /** @type {ArmyWave} */
        let wave = {
            left: {units: [], tools: []}, middle: {units: [], tools: []}, right: {units: [], tools: []}
        }
        for (const side in defenceStrength) {
            if (wave[side] == null) continue;
            let fillRange = false;
            let fillMelee = false;
            let maxSoldiersOnSide = CombatConst.getAmountSoldiers(side === "middle" ? 1 : 0, dungeon.level, flankUnitAmountBonus, frontUnitAmountBonus);
            let maxSoldierBoxesOnSide = side === "middle" ? CombatConst.getUnitSlotCountFront(dungeon.level) : CombatConst.getUnitSlotCountFlank(dungeon.level);
            meleeSoldiersSorted.sort((a, b) => -(a.item.meleeAttack * Math.min(a.count, maxSoldiersOnSide) - b.item.meleeAttack * Math.min(b.count, maxSoldiersOnSide)));
            rangeSoldiersSorted.sort((a, b) => -(a.item.rangeAttack * Math.min(a.count, maxSoldiersOnSide) - b.item.rangeAttack * Math.min(b.count, maxSoldiersOnSide)));
            if (defenceStrength[side].melee < defenceStrength[side].range) {
                if (meleeSoldiersSorted.length === 0) continue;
                fillMelee = true;
            } else if (defenceStrength[side].melee > defenceStrength[side].range) {
                if (rangeSoldiersSorted.length === 0) continue;
                fillRange = true;
            } else if (defenceStrength.center.melee < defenceStrength.center.range) {
                if (meleeSoldiersSorted.length === 0) continue;
                fillMelee = true;
            } else if (defenceStrength.center.melee > defenceStrength.center.range) {
                if (rangeSoldiersSorted.length === 0) continue;
                fillRange = true;
            } else if (meleeSoldiersSorted.length === 0) {
                if (rangeSoldiersSorted.length === 0) continue;
                fillRange = true;
            } else if (rangeSoldiersSorted.length === 0) {
                if (meleeSoldiersSorted.length === 0) continue;
                fillMelee = true;
            } else if (rangeSoldiersSorted[0].count > meleeSoldiersSorted[0].count) {
                if (rangeSoldiersSorted.length === 0) continue;
                fillRange = true;
            } else {
                if (meleeSoldiersSorted.length === 0) continue;
                fillMelee = true;
            }

            let sideAttackBonus = side === "middle" ? frontAttackBonus : flankAttackBonus;
            if (fillRange) {
                let unitCount = Math.min(maxSoldiersOnSide, rangeSoldiersSorted[0].count);
                let _unitCount = !rangeSoldiersSorted[1] ? 0 : Math.max(0, Math.min(maxSoldiersOnSide - unitCount, rangeSoldiersSorted[1].count));
                let bonus = 1 + lordRangeBonus + sideAttackBonus;
                let unitStrength = (unitCount * rangeSoldiersSorted[0].item.rangeAttack * bonus) + (!rangeSoldiersSorted[1] ? 0 : (_unitCount * rangeSoldiersSorted[1].item.rangeAttack * bonus));
                if (unitStrength > defenceStrength[side].range) {
                    wave[side].units.push({item: rangeSoldiersSorted[0].item, count: unitCount});
                    rangeSoldiersSorted[0].count -= unitCount;
                    if (maxSoldierBoxesOnSide > 1 && _unitCount > 0) {
                        wave[side].units.push({item: rangeSoldiersSorted[1].item, count: _unitCount});
                        rangeSoldiersSorted[1].count -= _unitCount;
                    }
                }
            }
            if (fillMelee) {
                let unitCount = Math.min(maxSoldiersOnSide, meleeSoldiersSorted[0].count);
                let _unitCount = !meleeSoldiersSorted[1] ? 0 : Math.max(0, Math.min(maxSoldiersOnSide - unitCount, meleeSoldiersSorted[1].count));
                let bonus = 1 + lordMeleeBonus + sideAttackBonus;
                let unitStrength = (unitCount * meleeSoldiersSorted[0].item.meleeAttack * bonus) + (!meleeSoldiersSorted[1] ? 0 : (_unitCount * meleeSoldiersSorted[1].item.meleeAttack * bonus));
                if (unitStrength > defenceStrength[side].melee) {
                    wave[side].units.push({item: meleeSoldiersSorted[0].item, count: unitCount});
                    meleeSoldiersSorted[0].count -= unitCount;
                    if (maxSoldierBoxesOnSide > 1 && _unitCount > 0) {
                        wave[side].units.push({item: meleeSoldiersSorted[1].item, count: _unitCount});
                        meleeSoldiersSorted[1].count -= _unitCount;
                    }
                }
            }
        }
        if (w === 0) {
            for (let i in wave) {
                if (wave[i].units.length > 0) {
                    for (let k in usedTools[i]) {
                        /** @type {InventoryItem<Tool>} */
                        let __tool = usedTools[i][k];
                        wave[i].tools.push(__tool);
                    }
                }
            }
        }
        for (let i in wave) {
            if (wave[i].units.length > 0) {
                army.push(wave);
                break;
            }
        }
    }
    return army;
}

/**
 *
 * @param {Client} client
 * @param {Socket} socket
 * @param {Player} thisPlayer
 * @param {CastleMapobject} castle
 * @param {Lord} lord
 * @returns {Promise<void>}
 */
async function attackDungeon(client, socket, thisPlayer, castle, lord) {
    return new Promise(async (resolve, reject) => {
        try {
            let dungeon = await getClosestDungeon(client, castle);
            /** @type {Castle} */
            let castleData = await client.getCastleInfo(castle);
            let availableTroops = castleData.unitInventory?.units;
            if (availableTroops == null) return reject("No troops!");
            let availableSoldiers = availableTroops.filter(t => t.item.isSoldier && t.item.fightType === 0);
            /** @type {InventoryItem<Tool>[]} */
            let availableDungeonAttackTools = availableTroops.filter(t => !t.item.isSoldier && t.item.fightType === 0 && t.item.canBeUsedToAttackNPC && t.item.name !== "Eventtool" && t.item.amountPerWave == null && (t.item.costC2 === undefined || t.item.costC2 === 0));
            if (availableSoldiers.length === 0) return reject('No attacking soldiers available');
            let dungeonProtection = getDungeonProtection(dungeon);
            let {
                attackLowerProtection, usedTools
            } = getAttackLowerProtectionDungeon(dungeon, lord, dungeonProtection, availableDungeonAttackTools);
            let defenceStrengthTotal = getDungeonDefenceStrength(dungeon, dungeonProtection, attackLowerProtection, usedTools);
            let army = getBestArmyForDungeon(thisPlayer, dungeon, defenceStrengthTotal, availableSoldiers, lord, usedTools, availableDungeonAttackTools);
            if(army.length === 0) return reject('Not enough attacking soldiers available');
            const horse = new Horse(client, castleData, HorseType.Coin);
            client.movements.startAttackMovement(castle, dungeon, army, lord, horse);
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}