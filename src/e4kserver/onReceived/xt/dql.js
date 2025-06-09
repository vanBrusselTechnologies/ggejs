const {buildings, dailyactivities} = require('e4k-data').data;
const Horse = require('../../../structures/Horse');
const MovementManager = require('../../../managers/MovementManager');
const {HorseType, WorldMapArea, SpyType} = require("../../../utils/Constants");
const CombatConst = require('../../../utils/CombatConst');

module.exports.name = "dql";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{PQL: number, RDQ:{QID:number, P:[number]}[], FDQ: number[], RS: [string,number|number[]][][]}} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    if (!socket['gbd finished']) return;
    if (!params) return;
    /** @type {Client} */
    const client = socket.client;
    try {
        /** @type {Player} */
        const thisPlayer = await client.players.getThisPlayer();
        if (!thisPlayer) return await require('./dql').execute(socket, errorCode, params);
        /** @type {CastleMapobject} */
        const myMainCastle = thisPlayer.castles.find(x => x.areaType === WorldMapArea.MainCastle);
        for (const quest of params.RDQ) {
            const dailyActivity = dailyactivities.find(da => da.dailyQuestID === quest?.QID);
            if (dailyActivity === undefined) continue;
            try {
                switch (quest.QID) {
                    case 1:
                        socket["dailySpyAt"] = -1;
                        socket["dailySabotageAt"] = -1;
                        socket["dailyGoodsTravelTryCount"] = 0;
                        await client.socketManager.reconnect();
                        break; //login;
                    case 2:
                        /** @type {Castle} */
                        const mainCastleInfo = await client.getCastleInfo(myMainCastle);
                        const dungeon = await getClosestDungeon(client, myMainCastle, false);
                        const horse = new Horse(client, mainCastleInfo, HorseType.Ruby_1);
                        client.movements.startSpyMovement(myMainCastle, dungeon, 1, SpyType.Military, 50, horse);
                        break; //spendC2
                    case 3:
                        break; //collectTax
                    case 4:
                        if (!socket["dailyGoodsTravelTryCount"]) socket["dailyGoodsTravelTryCount"] = 0;
                        /** @type {[string, number][]} */
                        const goods = [["W", 1], ["S", 1], ["F", 1]];
                        /** @type {WorldMapSector} */
                        const sector = await client.worldMaps.getSector(myMainCastle.kingdomId, myMainCastle.position.X, myMainCastle.position.Y);
                        const travelTargetCastles = sector.mapObjects.filter(o => o.ownerInfo !== undefined && o.ownerInfo?.playerId > 0 && o.ownerInfo.playerId !== thisPlayer.playerId && !o.ownerInfo.isRuin && (o.areaType === 1 || o.areaType === 4));
                        if (travelTargetCastles.length === 0) break;
                        const travelTargetCastle = travelTargetCastles.sort((a, b) => {
                            return MovementManager.getDistance(myMainCastle, a) - MovementManager.getDistance(myMainCastle, b)
                        })[socket["dailyGoodsTravelTryCount"]];
                        client.movements.startMarketMovement(myMainCastle, travelTargetCastle, goods);
                        socket["dailyGoodsTravelTryCount"] += 1;
                        break; //resourceToPlayer
                    case 5:
                        if (client.clientUserData.maxSpies <= 1) break;
                        if (socket["dailySpyAt"] === quest.P && socket["dailySpyTime"] + 1800000 >= Date.now()) break;
                        const d = await getClosestDungeon(client, myMainCastle, false);
                        client.movements.startSpyMovement(myMainCastle, d, Math.round(client.clientUserData.maxSpies / 4), SpyType.Military, 50);
                        socket["dailySpyAt"] = quest.P;
                        socket["dailySpyTime"] = Date.now();
                        break; //spy
                    case 6:
                        try {
                            if (socket["inDQL_q6"]) return;
                            socket["inDQL_q6"] = true;
                            const closestRuinsOutpost = getClosestRuinsOutpost(client, await client.worldMaps.get(0), myMainCastle);
                            if (socket["dailySabotageAt"] !== quest.P || socket["dailySabotageTime"] + 1800000 < Date.now()) {
                                client.movements.startSpyMovement(myMainCastle, closestRuinsOutpost, Math.round(client.clientUserData.maxSpies / 4), SpyType.Sabotage, 10);
                                socket["dailySabotageAt"] = quest.P;
                                socket["dailySabotageTime"] = Date.now();
                            }
                            delete socket["inDQL_q6"];
                        } catch (e) {
                            delete socket["inDQL_q6"];
                        }
                        break; //sabotageDamage
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 24:
                        const myCastle = dailyActivity.triggerKingdomID === 0 || quest.QID === 24 ? myMainCastle : thisPlayer.castles.find(x => x.kingdomId === dailyActivity.triggerKingdomID && x.areaType === WorldMapArea.KingdomCastle);
                        if (myCastle == null) break;
                        const lord = socket.client.equipments.getAvailableCommandants()[0];
                        if (lord == null) break;
                        await attackDungeon(client, thisPlayer, myCastle, lord);
                        await new Promise(resolve => setTimeout(resolve, 5000)); //Wait for the attack to be registered to avoid duplicate commander requests.
                        break; //countDungeons (24: tempServer)
                    case 13:
                        break; //craftEquipment todo
                    case 14:
                        // TODO: client.sendChatMessage(" ");
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
                        break; //completeMercenaryMission, handled in 'connection'
                    case 25:
                        break; //countBattles 10 tempServer todo
                    case 26:
                        break; //countBattles 15 tempServer todo
                    default:
                        console.warn('[DQL]', "Unknown Daily Activity Quest!", quest);
                }
            } catch (e) {
                if (socket.debug) console.error('[DQL]', quest.QID, e);
            }
        }
    } catch (e) {
        if (socket.debug) console.error('[DQL]', e);
    }
}


/**
 * @param {Client} client
 * @param {WorldMap} ClassicMap
 * @param {CastleMapobject} myMainCastle
 * @returns {CastleMapobject}
 */
function getClosestRuinsOutpost(client, ClassicMap, myMainCastle) {
    /** @type {CastleMapobject[]}*/
    const ruinedPlayerOutposts = ClassicMap.mapObjects.filter(x => {
        if (x.areaType !== WorldMapArea.Outpost) return false;
        const owner = x.ownerInfo;
        return owner.isRuin && !owner.isInAlliance && x.sabotageCooldownEnd === undefined;
    })
    ClassicMap = null;
    ruinedPlayerOutposts.sort((a, b) => {
        const distanceA = MovementManager.getDistance(myMainCastle, a);
        const distanceB = MovementManager.getDistance(myMainCastle, b);
        return distanceA - distanceB;
    })
    if (ruinedPlayerOutposts.length === 0) throw "No target found!";
    return ruinedPlayerOutposts[0];
}

/**
 * @param {Client} client
 * @param {CastleMapobject} castle
 * @param {boolean} attackable
 * @returns {Promise<DungeonMapobject>}
 */
async function getClosestDungeon(client, castle, attackable = true) {
    /** @type {DungeonMapobject[]} */
    const dungeons = (await client.worldMaps.getSector(castle.kingdomId, castle.position.X, castle.position.Y)).mapObjects.filter(x => x.areaType === WorldMapArea.Dungeon && (!attackable || !x.attackCooldownEnd) && (x.attackCount >= 1 || MovementManager.getDistance(x, castle) <= 12.5));
    if (dungeons.length === 0) throw "No target found!";
    dungeons.sort((a, b) => {
        const distanceA = MovementManager.getDistance(castle, a);
        const distanceB = MovementManager.getDistance(castle, b);
        return distanceA - distanceB;
    })
    if (attackable) {
        /** @type {Movement[]} */
        const movements = client.movements.get();
        while (true) {
            if (dungeons.length === 0) throw "No attackable dungeon found!";
            const __mov = movements.find(x => x.targetArea?.kingdomId === dungeons[0].kingdomId && x.targetArea.position.toString() === dungeons[0].position.toString());
            if (__mov == null) break; else dungeons.shift();
        }
    }
    const targetDungeon = dungeons[0];
    if (MovementManager.getDistance(castle, targetDungeon) > 50) throw "Target too far away";
    return targetDungeon;
}

/**
 * @param {DungeonMapobject} dungeon
 * @returns {{middle: {moat: number, gate: number, wall: number}, left: {moat: number, wall: number}, right: {moat: number, wall: number}}}
 */
function getDungeonProtection(dungeon) {
    /** @type {{left: {wall: number, moat: number}, middle: {wall: number, gate: number, moat: number}, right: {wall: number, moat: number}}} */
    const protection = {
        left: {
            wall: 0, moat: 0,
        }, middle: {
            wall: 0, gate: 0, moat: 0,
        }, right: {
            wall: 0, moat: 0,
        }
    }
    protection.middle.gate = buildings.find(b => b.wodID === dungeon.gateWodId).wallBonus;
    const dungeonWallBaseProtection = buildings.find(b => b.wodID === dungeon.wallWodId).wallBonus;
    for (const k in protection) {
        protection[k].wall = dungeonWallBaseProtection;
    }
    for (const __effect of dungeon.lord.effects) {
        if (__effect.name === "gateBonus") {
            protection.middle.gate += __effect.power;
        } else if (__effect.name === "wallBonus") {
            protection.left.wall += __effect.power;
            protection.middle.wall += __effect.power;
            protection.right.wall += __effect.power;
        }
    }
    for (const k in dungeon.defence.tools) {
        for (const /** @type {InventoryItem<Tool>}*/t of dungeon.defence.tools[k]) {
            const unitData = t.item.rawData;
            if (unitData.typ === "Defence") {
                if (unitData.wallBonus) protection[k].wall += unitData.wallBonus; else if (unitData.gateBonus) protection[k].gate += unitData.gateBonus; else if (unitData.moatBonus) protection[k].moat += unitData.moatBonus;
            }
        }
    }
    return protection;
}

/**
 * @param {DungeonMapobject} dungeon
 * @param {{left:{wall:number, moat:number}, middle:{wall:number, gate:number, moat:number}, right:{wall:number, moat:number}}} protection
 * @param {{left:{wall:number, moat:number}, middle:{wall:number, gate:number, moat:number}, right:{wall:number, moat:number}}} attackLowerProtection
 * @param {{ left: InventoryItem<Tool>[], middle: InventoryItem<Tool>[], right: InventoryItem<Tool>[] }} usedTools
 * @returns {{middle: {range: number, melee: number}, left: {range: number, melee: number}, center: {range: number, melee: number}, right: {range: number, melee: number}}}
 */
function getDungeonDefenceStrength(dungeon, protection, attackLowerProtection, usedTools) {
    /** @type {{left: {melee: number, range: number}, middle: {melee: number, range: number}, right: {melee: number, range: number}, center: {melee: number, range: number}}} */
    const meleeDefenceStrength = {
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
    /** @type {{left: {melee: number, range: number}, middle: {melee: number, range: number}, right: {melee: number, range: number}, center: {melee: number, range: number}}} */
    const rangeDefenceStrength = {
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
    for (const k in dungeon.defence.troops) {
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
    /** @type {{left: {melee: number, range: number}, middle: {melee: number, range: number}, right: {melee: number, range: number}, center: {melee: number, range: number}}} */
    const defenceStrengthBonus = {
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
    for (const __effect of dungeon.lord.effects) {
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
    for (const k in dungeon.defence.tools) {
        for (/** @type {InventoryItem<Tool>}*/const t of dungeon.defence.tools[k]) {
            /** @type {Unit} */
            const unit = t.item;
            if (unit.fightType === 1) {
                if (unit.meleeBonus) defenceStrengthBonus[k].melee += unit.meleeBonus; else if (unit.rangeBonus) defenceStrengthBonus[k].range += unit.rangeBonus;
            }
        }
    }
    for (const k in usedTools) {
        for (/** @type {InventoryItem<Tool>} */const toolAndCount of usedTools[k]) {
            /** @type {Unit} */
            const tool = toolAndCount.item;
            if (tool.fightType === 0) {
                if (tool.defRangeBonus) defenceStrengthBonus[k].range -= tool.defRangeBonus * toolAndCount.count;
            }
        }
    }
    for (const i in attackLowerProtection) {
        for (const j in attackLowerProtection[i]) {
            protection[i][j] -= attackLowerProtection[i][j];
        }
    }
    /** @type {{left: number, middle: number, right: number}} */
    const defenceBonusWGM = {
        left: (1 + Math.max(0, protection.left.wall / 100)) * (1 + Math.max(0, protection.left.moat / 100)) - 1,
        middle: (1 + Math.max(0, protection.middle.wall / 100)) * (1 + Math.max(0, protection.middle.gate / 100)) * (1 + Math.max(0, protection.middle.moat / 100)) - 1,
        right: (1 + Math.max(0, protection.right.wall / 100)) * (1 + Math.max(0, protection.right.moat / 100)) - 1,
    }
    /** @type {{left: {melee: number, range: number}, middle: {melee: number, range: number}, right: {melee: number, range: number}, center: {melee: number, range: number}}} */
    const totalDefenceBonus = {
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
    /** @type {{left: {melee: number, range: number}, middle: {melee: number, range: number}, right: {melee: number, range: number}, center: {melee: number, range: number}}} */
    const defenceStrengthTotal = {
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
    for (const k in defenceStrengthTotal) {
        for (const l in defenceStrengthTotal[k]) {
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
    /** @type {{left: {wall: number, moat: number}, middle: {wall: number, gate: number, moat: number}, right: {wall: number, moat: number}}} */
    const attackLowerProtection = {
        left: {
            wall: 0, moat: 0,
        }, middle: {
            wall: 0, gate: 0, moat: 0,
        }, right: {
            wall: 0, moat: 0,
        }
    }
    for (const effect of general.effects) {
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
    /** @type {{left: {wall: number, moat: number}, middle: {wall: number, gate: number, moat: number}, right: {wall: number, moat: number}}} */
    const restProtection = {
        left: {
            wall: 0, moat: 0,
        }, middle: {
            wall: 0, gate: 0, moat: 0,
        }, right: {
            wall: 0, moat: 0,
        }
    }
    for (const i in restProtection) {
        for (const j in restProtection[i]) {
            restProtection[i][j] = dungeonProtection[i][j] - attackLowerProtection[i][j];
        }
    }
    /** @type {{middle: InventoryItem<Tool>[], left: InventoryItem<Tool>[], right: InventoryItem<Tool>[]}} */
    const usedTools = {left: [], middle: [], right: []};
    const availableToolBoxesFlank = CombatConst.getToolSlotCountFlank(dungeon.level);
    const availableToolBoxesMiddle = CombatConst.getToolSlotCountFront(dungeon.level);
    const maxToolAmountFlank = CombatConst.getTotalAmountToolsFlank(dungeon.level);
    const maxToolAmountMiddle = CombatConst.getTotalAmountToolsMiddle(dungeon.level);

    const lordRangeDefenceBonus = dungeon.lord.effects.filter(e => e.name === "rangeBonus").map(e => e.power).reduce((sum, a) => sum + a, 0);
    for (const side in restProtection) {
        const sideIsMiddle = side === "middle"
        let toolsUsedOnSide = 0;
        const maxToolCountOnSide = sideIsMiddle ? maxToolAmountMiddle : maxToolAmountFlank;
        const availableToolBoxes = sideIsMiddle ? availableToolBoxesMiddle : availableToolBoxesFlank;
        if (availableToolBoxes >= 2) {
            for (const j in restProtection[side]) {
                if (restProtection[side][j] > 0) {
                    for (const availableTool of availableTools) {
                        const _tool = availableTool.item;
                        const _toolData = _tool.rawData;
                        if (_toolData[`${j}Bonus`] == null || restProtection[side][j] / _toolData[`${j}Bonus`] > availableTool.count) continue;
                        const _toolUseCount = Math.min(Math.ceil(restProtection[side][j] / _toolData[`${j}Bonus`]), maxToolCountOnSide - toolsUsedOnSide);
                        const tool = usedTools[side].find(t => t.item.wodId === _tool.wodId);
                        if (tool !== undefined) {
                            tool.count += _toolUseCount;
                            toolsUsedOnSide += _toolUseCount;
                        } else {
                            usedTools[side].push({item: _tool, count: _toolUseCount});
                            toolsUsedOnSide += _toolUseCount;
                        }
                        availableTool.count -= _toolUseCount;
                        restProtection[side][j] -= _toolUseCount * _toolData[`${j}Bonus`];
                        attackLowerProtection[side][j] += _toolUseCount * _toolData[`${j}Bonus`];
                        break;
                    }
                }
            }
            if (availableToolBoxes > usedTools[side].length) {
                const _rangeDefender = dungeon.defence.troops[side].find(x => x.item.rangeAttack !== undefined && x.item.rangeAttack > 0);
                if (_rangeDefender !== undefined) {
                    const availableShields = availableTools.filter(x => x.item.rawData.defRangeBonus != null);
                    if (availableShields.length > 0) {
                        const _tool = availableShields[0].item;
                        const _toolUseCount = Math.min(availableShields[0].count, Math.ceil((100 + lordRangeDefenceBonus) / _tool.rawData.defRangeBonus), maxToolCountOnSide - toolsUsedOnSide);
                        if (_toolUseCount > 0) {
                            usedTools[side].push({item: _tool, count: _toolUseCount});
                            availableShields[0].count -= _toolUseCount;
                        }
                    }
                }
            }
        }
        if (availableToolBoxes === 1) {
            let highestProtectionType = "";
            let highestProtectionValue = 0;
            for (const k in restProtection[side]) {
                if (restProtection[side][k] > highestProtectionValue) {
                    highestProtectionType = k;
                    highestProtectionValue = restProtection[side][k];
                }
            }
            const j = highestProtectionType;
            if (restProtection[side][j] > 0) {
                for (const availableTool of availableTools) {
                    const _tool = availableTool.item;
                    const _toolData = _tool.rawData;
                    if (_toolData[`${j}Bonus`] == null || restProtection[side][j] / _toolData[`${j}Bonus`] > availableTool.count) continue;
                    const _toolUseCount = Math.min(Math.ceil(restProtection[side][j] / _toolData[`${j}Bonus`]), maxToolCountOnSide - toolsUsedOnSide);
                    const tool = usedTools[side].find(t => t.item.wodId === _tool.wodId);
                    if (tool !== undefined) {
                        tool.count += _toolUseCount;
                        toolsUsedOnSide += _toolUseCount;
                    } else {
                        usedTools[side].push({item: _tool, count: _toolUseCount});
                        toolsUsedOnSide += _toolUseCount;
                    }
                    availableTool.count -= _toolUseCount;
                    restProtection[side][j] -= _toolUseCount * _toolData[`${j}Bonus`];
                    attackLowerProtection[side][j] += _toolUseCount * _toolData[`${j}Bonus`];
                    break;
                }
            } else {
                const _rangeDefender = dungeon.defence.troops[side].find(x => x.item.rangeAttack !== undefined && x.item.rangeAttack > 0);
                if (_rangeDefender !== undefined) {
                    const availableShields = availableTools.filter(x => x.item.rawData.defRangeBonus != null);
                    if (availableShields.length > 0) {
                        const _tool = availableShields[0].item;
                        const _toolUseCount = Math.min(availableShields[0].count, Math.ceil((100 + lordRangeDefenceBonus) / _tool.rawData.defRangeBonus), maxToolCountOnSide - toolsUsedOnSide);
                        if (_toolUseCount > 0) {
                            usedTools[side].push({item: _tool, count: _toolUseCount});
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
    let meleeStrength = 0;
    let rangeStrength = 0;
    for (const soldier of availableSoldiers) {
        const unit = soldier.item;
        const count = soldier.count;
        if (unit.rangeAttack) rangeStrength += unit.rangeAttack * count;
        if (unit.meleeAttack) meleeStrength += unit.meleeAttack * count;
    }
    const attackStrength = meleeStrength + rangeStrength;
    let _defenceStrengthTotal = 0;
    for (const side in defenceStrength) {
        for (const type in defenceStrength[side]) {
            _defenceStrengthTotal += defenceStrength[side][type];
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
    for (const effect of lord.effects) {
        if (effect.name === "meleeBonus" || effect.name === "offensiveMeleeBonus" || effect.name === "offensiveMeleeBonusPVE" || effect.name === "relicOffensiveMeleeBonus" || effect.name === "relicOffensiveMeleeBonusPVE" || effect.name === "relicMeleeBonus" || effect.name === "relicMeleeBonusPvE") {
            lordMeleeBonus += effect.power / 100;
        } else if (effect.name === "offensiveMeleeMalusPVE") {
            lordMeleeBonus -= Math.abs(effect.power) / 100;
        } else if (effect.name === "rangeBonus" || effect.name === "offensiveRangeBonus" || effect.name === "offensiveRangeBonusPVE" || effect.name === "relicOffensiveRangeBonus" || effect.name === "relicOffensiveRangeBonusPVE" || effect.name === "relicRangeBonus" || effect.name === "relicRangeBonusPvE") {
            lordRangeBonus += effect.power / 100;
        } else if (effect.name === "offensiveRangeMalusPVE") {
            lordRangeBonus -= Math.abs(effect.power) / 100;
        } else if (effect.name === "AttackBoostFront" || effect.name === "AttackBoostFront2" || effect.name === "relicAttackBoostFront") {
            frontAttackBonus += effect.power / 100;
        } else if (effect.name === "AttackBoostFlank" || effect.name === "AttackBoostFlank2" || effect.name === "relicAttackBoostFlank") {
            flankAttackBonus += effect.power / 100;
        } else if (effect.name === "AttackUnitAmountFront" || effect.name === "attackUnitAmountFrontPVE" || effect.name === "relicAttackUnitAmountFront" || effect.name === "relicAttackUnitAmountFrontPVE") {
            frontUnitAmountBonus += effect.power;
        } else if (effect.name === "attackUnitAmountFrontMalusPVE") {
            frontUnitAmountBonus -= Math.abs(effect.power);
        } else if (effect.name === "attackUnitAmountFlank" || effect.name === "attackUnitAmountFlankPVE" || effect.name === "relicAttackUnitAmountFlank" || effect.name === "relicAttackUnitAmountFlankPVE") {
            flankUnitAmountBonus += effect.power;
        } else if (effect.name === "attackUnitAmountFlankMalusPVE") {
            flankUnitAmountBonus -= Math.abs(effect.power);
        } else if (effect.name === "additionalWaves" || effect.name === "relicAdditionalWaves") {
            additionalWaves += effect.power;
        }
    }
    const meleeSoldiersSorted = availableSoldiers.filter(x => x.item.meleeAttack !== undefined);
    const rangeSoldiersSorted = availableSoldiers.filter(x => x.item.rangeAttack !== undefined);
    /** @type {ArmyWave[]} */
    const army = [];
    const waveCount = CombatConst.getMaxWaveCountWithBonus(player.playerLevel, false, additionalWaves);
    for (let w = 0; w < waveCount; w++) {
        /** @type {ArmyWave} */
        const wave = {
            left: {units: [], tools: []}, middle: {units: [], tools: []}, right: {units: [], tools: []}
        }
        for (const side in defenceStrength) {
            if (wave[side] == null) continue;
            let fillRange = false;
            let fillMelee = false;
            const maxSoldiersOnSide = CombatConst.getAmountSoldiers(side === "middle" ? 1 : 0, dungeon.level, flankUnitAmountBonus, frontUnitAmountBonus);
            const maxSoldierBoxesOnSide = side === "middle" ? CombatConst.getUnitSlotCountFront(dungeon.level) : CombatConst.getUnitSlotCountFlank(dungeon.level);
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

            const sideAttackBonus = side === "middle" ? frontAttackBonus : flankAttackBonus;
            if (fillRange) {
                const unitCount = Math.min(maxSoldiersOnSide, rangeSoldiersSorted[0].count);
                const _unitCount = !rangeSoldiersSorted[1] ? 0 : Math.max(0, Math.min(maxSoldiersOnSide - unitCount, rangeSoldiersSorted[1].count));
                const bonus = 1 + lordRangeBonus + sideAttackBonus;
                const unitStrength = (unitCount * rangeSoldiersSorted[0].item.rangeAttack * bonus) + (!rangeSoldiersSorted[1] ? 0 : (_unitCount * rangeSoldiersSorted[1].item.rangeAttack * bonus));
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
                const unitCount = Math.min(maxSoldiersOnSide, meleeSoldiersSorted[0].count);
                const _unitCount = !meleeSoldiersSorted[1] ? 0 : Math.max(0, Math.min(maxSoldiersOnSide - unitCount, meleeSoldiersSorted[1].count));
                const bonus = 1 + lordMeleeBonus + sideAttackBonus;
                const unitStrength = (unitCount * meleeSoldiersSorted[0].item.meleeAttack * bonus) + (!meleeSoldiersSorted[1] ? 0 : (_unitCount * meleeSoldiersSorted[1].item.meleeAttack * bonus));
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
            for (const side in wave) {
                if (wave[side].units.length > 0) {
                    for (const tool of usedTools[side]) {
                        wave[side].tools.push(tool);
                    }
                }
            }
        }
        for (const side in wave) {
            if (wave[side].units.length > 0) {
                army.push(wave);
                break;
            }
        }
    }
    return army;
}

/**
 * @param {Client} client
 * @param {Player} thisPlayer
 * @param {CastleMapobject} castle
 * @param {Lord} lord
 * @returns {Promise<void>}
 */
async function attackDungeon(client, thisPlayer, castle, lord) {
    const dungeon = await getClosestDungeon(client, castle);
    /** @type {Castle} */
    const castleData = await client.getCastleInfo(castle);
    const availableTroops = castleData.unitInventory?.units;
    if (availableTroops == null) throw "No troops!";
    const availableSoldiers = availableTroops.filter(t => t.item.isSoldier && t.item.fightType === 0);
    /** @type {InventoryItem<Tool>[]} */
    const availableDungeonAttackTools = availableTroops.filter(t => !t.item.isSoldier && t.item.fightType === 0 && t.item.canBeUsedToAttackNPC && t.item.name !== "Eventtool" && t.item.amountPerWave == null && (t.item.costC2 === undefined || t.item.costC2 === 0));
    if (availableSoldiers.length === 0) throw 'No attacking soldiers available';
    const dungeonProtection = getDungeonProtection(dungeon);
    const {
        attackLowerProtection, usedTools
    } = getAttackLowerProtectionDungeon(dungeon, lord, dungeonProtection, availableDungeonAttackTools);
    const defenceStrengthTotal = getDungeonDefenceStrength(dungeon, dungeonProtection, attackLowerProtection, usedTools);
    const army = getBestArmyForDungeon(thisPlayer, dungeon, defenceStrengthTotal, availableSoldiers, lord, usedTools, availableDungeonAttackTools);
    if (army.length === 0) throw 'Not enough attacking soldiers available';
    const horse = new Horse(client, castleData, HorseType.Coin);
    client.movements.startAttackMovement(castle, dungeon, army, lord, horse);
}