const dailyActivities = require("./../../../data/ingame_data/dailyactivities.json");
const Constants = require("./../../../utils/Constants");
const sendSpyMovement = require("./../../commands/sendSpyMovement");
const sendMarketMovement = require("./../../commands/sendMarketMovement");
const buildings = require("./../../../data/ingame_data/buildings.json");
const sendArmyAttackMovement = require("./../../commands/sendArmyAttackMovement");

module.exports = {
    name: "dql",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute: async function (socket, errorCode, params) {
        if (!params) return;
        /** @type {Client} */
        let client = socket.client;
        try {
            let thisPlayer = await client.players.getThisPlayer();
            if (!thisPlayer) {
                await require('./dql').execute(socket, errorCode, params);
                return;
            }
            let myMainCastle = thisPlayer.castles.find(x => x.areaType === 1);
            /** @type {Worldmap} */
            let ClassicMap = await client.worldmaps.get(0);
            const closestDungeonClassicMap = await getClosestDungeon(client, myMainCastle, false);
            for (let i in params.RDQ) {
                let quest = params.RDQ[i];
                for (let j in dailyActivities) {
                    if (parseInt(dailyActivities[j].dailyQuestID) === quest?.QID) {
                        switch (quest.QID) {
                            case 1:
                                try {
                                    socket["dailySpyAt"] = -1;
                                    socket["dailySabotageAt"] = -1;
                                    socket["dailyGoodsTravelTryCount"] = 0;
                                    await client.__x__x__relogin();
                                } catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //login;
                            case 2:
                                try {
                                    const mainCastleInfo = await client.getCastleInfo(myMainCastle);
                                    let _foundBuildings = mainCastleInfo.castle.buildings;
                                    let horseWodId = getHorseWodId(_foundBuildings, 1);
                                    sendSpyMovement.execute(socket, myMainCastle, closestDungeonClassicMap, 1, 0, 50, horseWodId);
                                } catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //spendC2
                            case 3:
                                break; //collectTax
                            case 4:
                                if (!socket["dailyGoodsTravelTryCount"]) socket["dailyGoodsTravelTryCount"] = 0;
                                const goods = [["W", 1], ["S", 1], ["F", 1]];
                                let nonRuins = ClassicMap.players.filter(x => !x.isRuin && x.playerId !== thisPlayer.playerId);
                                nonRuins.sort((a, b) => {
                                    let distanceA = 10000;
                                    for (let k in a.castles) {
                                        let __castle = a.castles[k];
                                        if (__castle.areaType !== 1 && __castle.areaType !== 4) continue;
                                        let castleDistance = getDistance(myMainCastle, __castle);
                                        distanceA = Math.min(distanceA, castleDistance)
                                    }
                                    let distanceB = 10000;
                                    for (let k in b.castles) {
                                        let __castle = b.castles[k];
                                        if (__castle.areaType !== 1 && __castle.areaType !== 4) continue;
                                        let castleDistance = getDistance(myMainCastle, __castle);
                                        distanceB = Math.min(distanceB, castleDistance)
                                    }
                                    return distanceA - distanceB;
                                })
                                const _targetCastles = nonRuins[socket["dailyGoodsTravelTryCount"]].castles;
                                let _targetArea = _targetCastles[0];
                                let _targetAreaDistance = 1000000;
                                for (let k in _targetCastles) {
                                    let __castle = _targetCastles[k];
                                    if (__castle.areaType !== 1 && __castle.areaType !== 4) continue;
                                    let castleDistance = getDistance(myMainCastle, __castle);
                                    if (castleDistance < _targetAreaDistance) {
                                        _targetAreaDistance = castleDistance;
                                        _targetArea = __castle;
                                    }
                                }
                                sendMarketMovement.execute(socket, myMainCastle, _targetArea, goods);
                                socket["dailyGoodsTravelTryCount"] += 1;
                                break; //resourceToPlayer
                            case 5:
                                if (socket["dailySpyAt"] !== quest.P || socket["dailySpyTime"] + 1800000 < Date.now()) {
                                    sendSpyMovement.execute(socket, myMainCastle, closestDungeonClassicMap, Math.round(client["maxSpies"] / 4), 0, 50);
                                    socket["dailySpyAt"] = quest.P;
                                    socket["dailySpyTime"] = Date.now();
                                }
                                break; //spy
                            case 6:
                                try {
                                    const closestRuinsOutpost = await getClosestRuinsOutpost(client, ClassicMap, myMainCastle);
                                    if (socket["dailySabotageAt"] !== quest.P || socket["dailySabotageTime"] + 1800000 < Date.now()) {
                                        sendSpyMovement.execute(socket, myMainCastle, await closestRuinsOutpost, Math.round(client["maxSpies"] / 4), 2, 10);
                                        socket["dailySabotageAt"] = quest.P;
                                        socket["dailySabotageTime"] = Date.now();
                                    }
                                } catch (e) {
                                    if (socket["debug"]) {
                                        console.log("Quest QID 6 error");
                                        console.log(e);
                                    }
                                }
                                break; //sabotageDamage
                            case 7:
                                try {
                                    let lord = socket["generals"][0];
                                    attackDungeon(client, socket, thisPlayer, myMainCastle, lord);
                                } catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //countDungeons kId=0
                            case 8:
                                try {
                                    let myKingdomCastle = thisPlayer.castles.find(x =>
                                        x.kingdomId === 2 &&
                                        x.areaType === Constants.WorldmapArea.KingdomCastle
                                    );
                                    let lord = socket["generals"][1];
                                    attackDungeon(client, socket, thisPlayer, myKingdomCastle, lord);
                                } catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //countDungeons kId=2
                            case 9:
                                try {
                                    let myKingdomCastle = thisPlayer.castles.find(x =>
                                        x.kingdomId === 1 &&
                                        x.areaType === Constants.WorldmapArea.KingdomCastle
                                    );
                                    let lord = socket["generals"][2];
                                    attackDungeon(client, socket, thisPlayer, myKingdomCastle, lord);
                                } catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //countDungeons kId=1
                            case 10:
                                try {
                                    let myKingdomCastle = thisPlayer.castles.find(x =>
                                        x.kingdomId === 3 &&
                                        x.areaType === Constants.WorldmapArea.KingdomCastle
                                    );
                                    let lord = socket["generals"][3];
                                    attackDungeon(client, socket, thisPlayer, myKingdomCastle, lord);
                                } catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //countDungeons kId=3
                            case 13:
                                break; //craftEquipment
                            case 14:
                                client.sendChatMessage(" ");
                                break; //writeInAllianceChat
                            case 15:
                                break; //collectFromCitizen
                            case 16:
                                break; //recruitUnits
                            case 17:
                                break; //produceTools
                            case 21:
                                break; //requestAllianceHelp
                            case 22:
                                break; //completeMercenaryMission
                            case 24:
                                break; //countDungeons tempServer
                            case 25:
                                break; //countBattles 10 tempServer
                            case 26:
                                break; //countBattles 15 tempServer
                            default:
                                console.log("Unknown Daily Activity Quest!");
                        }
                        break;
                    }
                }
            }
        } catch (e) {
            if (socket["debug"])
                console.log(e);
        }
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
            let ruinedAlliancelessPlayersWithOutposts = ClassicMap.players.filter(x =>
                x.isRuin && !x.allianceName && x.castles.find(y => y.areaType === Constants.WorldmapArea.Outpost)
            )
            ruinedAlliancelessPlayersWithOutposts.sort((a, b) => {
                let distanceA = 10000;
                for (let k in a.castles) {
                    let __castle = a.castles[k];
                    if (__castle.areaType !== Constants.WorldmapArea.Outpost) continue;
                    let castleDistance = getDistance(myMainCastle, __castle);
                    distanceA = Math.min(distanceA, castleDistance)
                }
                let distanceB = 10000;
                for (let k in b.castles) {
                    let __castle = b.castles[k];
                    if (__castle.areaType !== Constants.WorldmapArea.Outpost) continue;
                    let castleDistance = getDistance(myMainCastle, __castle);
                    distanceB = Math.min(distanceB, castleDistance)
                }
                return distanceA - distanceB;
            })
            if (ruinedAlliancelessPlayersWithOutposts.length === 0) reject("No target found!");
            let _target = ruinedAlliancelessPlayersWithOutposts[0];
            let targetArea = null;
            let _targetAreaDistance = 10000;
            for (let k in _target.castles) {
                let __castle = _target.castles[k];
                if (__castle.areaType !== Constants.WorldmapArea.Outpost) continue;
                let castleDistance = getDistance(myMainCastle, __castle);
                if (castleDistance < _targetAreaDistance) {
                    targetArea = __castle;
                    _targetAreaDistance = castleDistance;
                }
            }
            resolve(targetArea);
        } catch (e) {
            reject(e);
        }
    })
}

/**
 *
 * @param {Client} client
 * @param {CastleMapobject} myKingdomCastle
 * @param {boolean} attackable
 * @returns {Promise<DungeonMapobject>}
 */
function getClosestDungeon(client, myKingdomCastle, attackable = true) {
    return new Promise(async (resolve, reject) => {
        try {
            /**@type {Worldmap} */
            let worldmap = await client.worldmaps.get(myKingdomCastle.kingdomId);
            let dungeons = worldmap.mapobjects.filter(x => x.areaType === Constants.WorldmapArea.Dungeon && (!attackable || !x.attackCooldownEnd));
            dungeons.sort((a, b) => {
                let distanceA = getDistance(myKingdomCastle, a);
                let distanceB = getDistance(myKingdomCastle, b);
                return distanceA - distanceB;
            })
            if (dungeons.length === 0) reject("No dungeon found!");
            let targetDungeon = dungeons[0];
            if (getDistance(myKingdomCastle, targetDungeon) > 20) reject("Target too far away");
            resolve(targetDungeon);
        } catch (e) {
            reject(e);
        }
    })
}

/**
 *
 * @param {BasicMapobject} source
 * @param {BasicMapobject} target
 * @returns {number}
 */
function getDistance(source, target) {
    return Math.sqrt(Math.pow(source.position.X - target.position.X, 2) + Math.pow(source.position.Y - target.position.Y, 2));
}

/**
 *
 * @param {DungeonMapobject} dungeon
 * @returns {{middle: {moat: number, gate: number, wall: number}, left: {moat: number, wall: number}, right: {moat: number, wall: number}}}
 */
function getDungeonProtection(dungeon) {
    let protection = {
        left: {
            wall: 0,
            moat: 0,
        },
        middle: {
            wall: 0,
            gate: 0,
            moat: 0,
        },
        right: {
            wall: 0,
            moat: 0,
        }
    }
    let dungeonWallBaseProtection = 0;
    let dungeonGateBaseProtection = 0;
    for (let j in buildings) {
        if (parseInt(buildings[j].wodID) === dungeon.wallWodId) {
            dungeonWallBaseProtection = parseInt(buildings[j].wallBonus);
            if (dungeonGateBaseProtection !== 0) break;
        }
        if (parseInt(buildings[j].wodID) === dungeon.gateWodId) {
            dungeonGateBaseProtection = parseInt(buildings[j].gateBonus);
            if (dungeonWallBaseProtection !== 0) break;
        }
    }
    protection.middle.gate = dungeonGateBaseProtection;
    for (let k in protection) {
        protection[k].wall = dungeonWallBaseProtection;
    }
    for (let k in dungeon.lord.effects) {
        let __effect = dungeon.lord.effects[k];
        if (__effect.name === "gateBonus") {
            protection.middle.gate += __effect.power;
        } else if (__effect.name === "wallBonus") {
            protection.left.wall += __effect.power;
            protection.middle.wall += __effect.power;
            protection.right.wall += __effect.power;
        }
    }
    for (let k in dungeon.defence.tools) {
        for (let l in dungeon.defence.tools[k]) {
            const unitData = dungeon.defence.tools[k][l].unit.rawData;
            if (unitData.typ === "Defence") {
                if (unitData.wallBonus)
                    protection[k].wall += parseInt(unitData.wallBonus);
                else if (unitData.gateBonus)
                    protection[k].gate += parseInt(unitData.gateBonus);
                else if (unitData.moatBonus)
                    protection[k].moat += parseInt(unitData.moatBonus);
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
 * @param {{ left: {tool: Unit, count: number}[], middle: {tool: Unit, count: number}[], right: {tool: Unit, count: number}[] }} usedTools
 * @returns {{middle: {range: number, melee: number}, left: {range: number, melee: number}, center: {range: number, melee: number}, right: {range: number, melee: number}}}
 */
function getDungeonDefenceStrength(dungeon, protection, attackLowerProtection, usedTools) {
    let defenceStrength = {
        left: {
            melee: 0,
            range: 0,
        },
        middle: {
            melee: 0,
            range: 0,
        },
        right: {
            melee: 0,
            range: 0,
        },
        center: {
            melee: 0,
            range: 0,
        }
    }
    for (let k in dungeon.defence.troops) {
        for (let l in dungeon.defence.troops[k]) {
            /** @type {Unit} */
            const unit = dungeon.defence.troops[k][l].unit;
            /** @type {number} */
            const count = dungeon.defence.troops[k][l].count;
            defenceStrength[k].range += unit.rangeDefence * count;
            defenceStrength[k].melee += unit.meleeDefence * count;
        }
    }
    let defenceStrengthBonus = {
        left: {
            melee: 0,
            range: 0,
        },
        middle: {
            melee: 0,
            range: 0,
        },
        right: {
            melee: 0,
            range: 0,
        },
        center: {
            melee: 0,
            range: 0,
        }
    }
    for (let k in dungeon.lord.effects) {
        let __effect = dungeon.lord.effects[k];
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
        for (let l in dungeon.defence.tools[k]) {
            /** @type {Unit} */
            const unit = dungeon.defence.tools[k][l].unit;
            if (unit.fightType === 1) {
                if (unit.meleeBonus)
                    defenceStrengthBonus[k].melee += unit.meleeBonus;
                else if (unit.rangeBonus)
                    defenceStrengthBonus[k].range += unit.rangeBonus;
            }
        }
    }
    for (let k in usedTools) {
        for (let toolAndCount of usedTools[k]) {
            /** @type {Unit} */
            const tool = toolAndCount.tool;
            if (tool.fightType === 0) {
                if (tool.defRangeBonus)
                    defenceStrengthBonus[k].range -= tool.defRangeBonus * toolAndCount.count;
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
        },
        middle: {
            melee: (1 + defenceBonusWGM.middle) * (1 + defenceStrengthBonus.middle.melee / 100),
            range: (1 + defenceBonusWGM.middle) * (1 + defenceStrengthBonus.middle.range / 100),
        },
        right: {
            melee: (1 + defenceBonusWGM.right) * (1 + defenceStrengthBonus.right.melee / 100),
            range: (1 + defenceBonusWGM.right) * (1 + defenceStrengthBonus.right.range / 100),
        },
        center: {
            melee: 1 + defenceStrengthBonus.center.melee / 100,
            range: 1 + defenceStrengthBonus.center.range / 100,
        }
    }
    let defenceStrengthTotal = {
        left: {
            melee: 0,
            range: 0,
        },
        middle: {
            melee: 0,
            range: 0,
        },
        right: {
            melee: 0,
            range: 0,
        },
        center: {
            melee: 0,
            range: 0,
        }
    }
    for (let k in defenceStrengthTotal) {
        for (let l in defenceStrengthTotal[k]) {
            defenceStrengthTotal[k][l] = defenceStrength[k][l] * totalDefenceBonus[k][l];
        }
    }
    return defenceStrengthTotal;
}

/**
 * @param {DungeonMapobject} dungeon
 * @param {Lord} general
 * @param {{left:{wall:number, moat:number}, middle:{wall:number, gate:number, moat:number}, right:{wall:number, moat:number}}} dungeonProtection
 * @param {{unit: Unit, count: number}[]} _availableTools
 * @returns {{attackLowerProtection:{ left: { wall: number, moat: number }, middle: { wall: number, gate: number, moat: number }, right: { wall: number, moat: number } },usedTools: { left: {tool: Unit, count: number}[], middle: {tool: Unit, count: number}[], right: {tool: Unit, count: number}[] }}}
 */
function getAttackLowerProtectionDungeon(dungeon, general, dungeonProtection, _availableTools) {
    /** @type {{unit: Unit, count: number}[]} */
    let availableTools = JSON.parse(JSON.stringify(_availableTools));
    let attackLowerProtection = {
        left: {
            wall: 0,
            moat: 0,
        },
        middle: {
            wall: 0,
            gate: 0,
            moat: 0,
        },
        right: {
            wall: 0,
            moat: 0,
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
            wall: 0,
            moat: 0,
        },
        middle: {
            wall: 0,
            gate: 0,
            moat: 0,
        },
        right: {
            wall: 0,
            moat: 0,
        }
    }
    for (let i in restProtection) {
        for (let j in restProtection[i]) {
            restProtection[i][j] = dungeonProtection[i][j] - attackLowerProtection[i][j];
        }
    }
    let usedTools = {
        left: [],
        middle: [],
        right: []
    };
    let availableToolBoxesFlank = getToolBoxesCountFlank(dungeon.level);
    let availableToolBoxesMiddle = getToolBoxesCountMiddle(dungeon.level);
    let maxToolAmountFlank = getMaxToolAmountFlank(dungeon.level);
    let maxToolAmountMiddle = getMaxToolAmountMiddle(dungeon.level);
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
                        let _tool = availableTools[k].unit;
                        const _toolData = _tool.rawData;
                        if (_toolData[`${j}Bonus`]) {
                            if (restProtection[i][j] / _toolData[`${j}Bonus`] < availableTools[k].count) {
                                let __foundTool = false;
                                let _toolUseCount = Math.min(Math.ceil(restProtection[i][j] / _toolData[`${j}Bonus`]), maxToolCountOnSide - toolsUsedOnSide);
                                for (let l in usedTools[i]) {
                                    if (usedTools[i][l].tool.wodId === _tool.wodId) {
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
                                    usedTools[i].push({tool: _tool, count: _toolUseCount});
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
                let _rangeDefenders = dungeon.defence.troops[i].filter(x => x.unit.rangeAttack > 0);
                if (_rangeDefenders.length > 0) {
                    let availableShields = _availableTools.filter(x => x.unit.defRangeBonus != null);
                    let _tool = availableShields[0].unit;
                    let _toolUseCount = Math.ceil((100 + lordRangeDefenceBonus) / _tool.defRangeBonus);
                    _toolUseCount = Math.min(availableShields[0].count, _toolUseCount, maxToolCountOnSide - toolsUsedOnSide);
                    if(_toolUseCount > 0) {
                        usedTools[i].push({tool: _tool, count: _toolUseCount});
                        availableShields[0].count -= _toolUseCount;
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
                    let _tool = availableTools[k].unit;
                    const _toolData = _tool.rawData;
                    if (_toolData[`${j}Bonus`]) {
                        if (restProtection[i][j] / _toolData[`${j}Bonus`] < availableTools[k].count) {
                            let __foundTool = false;
                            let _toolUseCount = Math.min(Math.ceil(restProtection[i][j] / _toolData[`${j}Bonus`]), maxToolCountOnSide - toolsUsedOnSide);
                            for (let l in usedTools[i]) {
                                if (usedTools[i][l].tool.wodId === _tool.wodId) {
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
                                usedTools[i].push({tool: _tool, count: _toolUseCount});
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
                let _rangeDefenders = dungeon.defence.troops[i].filter(x => x.unit.rangeAttack > 0);
                if (_rangeDefenders.length > 0) {
                    let availableShields = _availableTools.filter(x => x.unit.defRangeBonus != null);
                    let _tool = availableShields[0].unit;
                    let _toolUseCount = Math.ceil((100 + lordRangeDefenceBonus) / _tool.defRangeBonus);
                    _toolUseCount = Math.min(availableShields[0].count, _toolUseCount, maxToolCountOnSide - toolsUsedOnSide);
                    if(_toolUseCount > 0) {
                        usedTools[i].push({tool: _tool, count: _toolUseCount});
                        availableShields[0].count -= _toolUseCount;
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
 * @param {{unit: Unit, count: number}[]} availableSoldiers
 * @param {Lord} lord
 * @param {{ left: {tool: Unit, count: number}[], middle: {tool: Unit, count: number}[], right: {tool: Unit, count: number}[] }} usedTools
 * @param {{unit: Unit, count: number}[]} availableTools
 * @returns {{ L: { U: [], T: [] }, M: { U: [], T: [] }, R: { U: [], T: [] } }[]}
 */
function getBestArmyForDungeon(player, dungeon, defenceStrength, availableSoldiers, lord, usedTools, availableTools) {
    let attackStrength = 0;
    let meleeStrength = 0;
    let rangeStrength = 0;
    for (let soldier of availableSoldiers) {
        let unit = soldier.unit;
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
            lordMeleeBonus -= _effect.power / 100;
        } else if (_effect.name === "rangeBonus" || _effect.name === "offensiveRangeBonus" || _effect.name === "offensiveRangeBonusPVE" || _effect.name === "relicOffensiveRangeBonus" || _effect.name === "relicOffensiveRangeBonusPVE" || _effect.name === "relicRangeBonus" || _effect.name === "relicRangeBonusPvE") {
            lordRangeBonus += _effect.power / 100;
        } else if (_effect.name === "offensiveRangeMalusPVE") {
            lordRangeBonus -= _effect.power / 100;
        } else if (_effect.name === "AttackBoostFront" || _effect.name === "AttackBoostFront2" || _effect.name === "relicAttackBoostFront") {
            frontAttackBonus += _effect.power / 100;
        } else if (_effect.name === "AttackBoostFlank" || _effect.name === "AttackBoostFlank2" || _effect.name === "relicAttackBoostFlank") {
            flankAttackBonus += _effect.power / 100;
        } else if (_effect.name === "AttackUnitAmountFront" || _effect.name === "attackUnitAmountFrontPVE" || _effect.name === "relicAttackUnitAmountFront" || _effect.name === "relicAttackUnitAmountFrontPVE") {
            frontUnitAmountBonus += _effect.power;
        } else if (_effect.name === "attackUnitAmountFrontMalusPVE") {
            frontUnitAmountBonus -= _effect.power;
        } else if (_effect.name === "attackUnitAmountFlank" || _effect.name === "attackUnitAmountFlankPVE" || _effect.name === "relicAttackUnitAmountFlank" || _effect.name === "relicAttackUnitAmountFlankPVE") {
            flankUnitAmountBonus += _effect.power;
        } else if (_effect.name === "attackUnitAmountFlankMalusPVE") {
            flankUnitAmountBonus -= _effect.power;
        } else if (_effect.name === "additionalWaves" || _effect.name === "relicAdditionalWaves") {
            additionalWaves += _effect.power;
        }
    }
    let meleeSoldiersSorted = availableSoldiers.filter(x => x.unit.meleeAttack !== undefined);
    let rangeSoldiersSorted = availableSoldiers.filter(x => x.unit.rangeAttack !== undefined);
    let army = [];
    let waveCount = getMaxWaves(player.playerLevel, false);
    for (let w = 0; w < waveCount; w++) {
        let wave = {L: {U: [], T: []}, M: {U: [], T: []}, R: {U: [], T: []}}
        for (let i in defenceStrength) {
            let side = i === "left" ? "L" : i === "middle" ? "M" : i === "right" ? "R" : "";
            if (side === "") continue;
            let fillRange = false;
            let fillMelee = false;
            let maxSoldiersOnSide = side === "M" ? getMaxSoldiersMiddle(dungeon.level, frontUnitAmountBonus) : getMaxSoldiersFlank(dungeon.level, flankUnitAmountBonus);
            let maxSoldierBoxesOnSide = side === "M" ? getSoldierBoxesCountMiddle(dungeon.level) : getSoldierBoxesCountFlank(dungeon.level);
            meleeSoldiersSorted.sort((a, b) => -(a.unit.meleeAttack * Math.min(a.count, maxSoldiersOnSide) - b.unit.meleeAttack * Math.min(b.count, maxSoldiersOnSide)));
            rangeSoldiersSorted.sort((a, b) => -(a.unit.rangeAttack * Math.min(a.count, maxSoldiersOnSide) - b.unit.rangeAttack * Math.min(b.count, maxSoldiersOnSide)));
            if (defenceStrength[i].melee < defenceStrength[i].range) {
                if (meleeSoldiersSorted.length === 0) continue;
                fillMelee = true;
            } else if (defenceStrength[i].melee > defenceStrength[i].range) {
                if (rangeSoldiersSorted.length === 0) continue;
                fillRange = true;
            } else if (defenceStrength.center.melee < defenceStrength.center.range) {
                if (meleeSoldiersSorted.length === 0) continue;
                fillMelee = true;
            } else if (defenceStrength.center.melee > defenceStrength.center.range) {
                if (rangeSoldiersSorted.length === 0) continue;
                fillRange = true;
            } else if (rangeSoldiersSorted.length > 0 || meleeSoldiersSorted.length > 0) {
                if (meleeSoldiersSorted.length === 0 || rangeSoldiersSorted[0].count > meleeSoldiersSorted[0].count) {
                    if (rangeSoldiersSorted.length === 0) continue;
                    fillRange = true;
                } else {
                    if (meleeSoldiersSorted.length === 0) continue;
                    fillMelee = true;
                }
            }
            let sideAttackBonus = side === "M" ? frontAttackBonus : flankAttackBonus;
            if (fillRange) {
                let unitCount = Math.min(maxSoldiersOnSide, rangeSoldiersSorted[0].count);
                let _unitCount = !rangeSoldiersSorted[1] ? 0 : Math.max(0, Math.min(maxSoldiersOnSide - unitCount, rangeSoldiersSorted[1].count));
                let bonus = 1 + lordRangeBonus + sideAttackBonus;
                let unitsStrength = (unitCount * rangeSoldiersSorted[0].unit.rangeAttack * bonus) + (!rangeSoldiersSorted[1] ? 0 : (_unitCount * rangeSoldiersSorted[1].unit.rangeAttack * bonus));
                if (unitsStrength > defenceStrength[i].range) {
                    wave[side]["U"].push([rangeSoldiersSorted[0].unit.wodId, unitCount]);
                    rangeSoldiersSorted[0].count -= unitCount;
                    if (maxSoldierBoxesOnSide > 1 && _unitCount > 0) {
                        wave[side]["U"].push([rangeSoldiersSorted[1].unit.wodId, _unitCount]);
                        rangeSoldiersSorted[1].count -= _unitCount;
                    }
                }
            }
            if (fillMelee) {
                let unitCount = Math.min(maxSoldiersOnSide, meleeSoldiersSorted[0].count);
                let _unitCount = !meleeSoldiersSorted[1] ? 0 : Math.max(0, Math.min(maxSoldiersOnSide - unitCount, meleeSoldiersSorted[1].count));
                let bonus = 1 + lordMeleeBonus + sideAttackBonus;
                let unitsStrength = (unitCount * meleeSoldiersSorted[0].unit.meleeAttack * bonus) + (!meleeSoldiersSorted[1] ? 0 : (_unitCount * meleeSoldiersSorted[1].unit.meleeAttack * bonus));
                if (unitsStrength > defenceStrength[i].melee) {
                    wave[side]["U"].push([meleeSoldiersSorted[0].unit.wodId, unitCount]);
                    meleeSoldiersSorted[0].count -= unitCount;
                    if (maxSoldierBoxesOnSide > 1 && _unitCount > 0) {
                        wave[side]["U"].push([meleeSoldiersSorted[1].unit.wodId, _unitCount]);
                        meleeSoldiersSorted[1].count -= _unitCount;
                    }
                }
            }
        }
        if (w === 0) {
            for (let i in wave) {
                if (wave[i].U.length > 0) {
                    let j = i === "L" ? "left" : i === "M" ? "middle" : i === "R" ? "right" : "";
                    for (let k in usedTools[j]) {
                        /** @type {{tool:Unit, count: number}} */
                        let __tool = usedTools[j][k];
                        wave[i].T.push([__tool.tool.wodId, __tool.count]);
                    }
                }
            }
        }
        army.push(wave);
    }
    return army;
}

/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
function getSoldierBoxesCountMiddle(defenderLevel) {
    if (defenderLevel < 26) return 2;
    return 3
}

/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
function getSoldierBoxesCountFlank(defenderLevel) {
    if (defenderLevel < 37) return 1;
    return 2;
}

/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
function getToolBoxesCountMiddle(defenderLevel) {
    if (defenderLevel < 11) return 1;
    if (defenderLevel < 37) return 2;
    return 3
}

/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
function getToolBoxesCountFlank(defenderLevel) {
    if (defenderLevel < 37) return 1;
    return 2;
}

/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
function getMaxToolAmountMiddle(defenderLevel) {
    if (defenderLevel < 11) return 10;
    if (defenderLevel < 37) return 20;
    if (defenderLevel < 50) return 30;
    if (defenderLevel < 69) return 40;
    return 50;
}

/**
 *
 * @param {number} defenderLevel
 * @param {number} toolFlankBonus
 * @returns {number}
 */
function getMaxToolAmountFlank(defenderLevel, toolFlankBonus = 0) {
    if (defenderLevel < 37) return 10;
    if (defenderLevel < 50) return 20;
    if (defenderLevel < 69) return 30;
    return Math.ceil(40 + toolFlankBonus);
}

/**
 *
 * @param {number} defenderLevel
 * @param {number} soldierFrontBonus
 * @returns {number}
 */
function getMaxSoldiersMiddle(defenderLevel, soldierFrontBonus = 0) {
    return Math.ceil((getMaxSoldiersPerWave(defenderLevel) - getMaxSoldiersFlank(defenderLevel) * 2) * (1 + soldierFrontBonus / 100))
}

/**
 *
 * @param {number} defenderLevel
 * @param {number} soldierFlankBonus
 * @returns {number}
 */
function getMaxSoldiersFlank(defenderLevel, soldierFlankBonus = 0) {
    return Math.ceil(getMaxSoldiersPerWave(defenderLevel) * 0.2 * (1 + soldierFlankBonus / 100))
}

/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
function getMaxSoldiersPerWave(defenderLevel) {
    if (defenderLevel <= 69) return Math.min(260, 5 * defenderLevel + 8);
    return 320;
}

/**
 *
 * @param {number} level
 * @param {boolean} conquerAttack
 * @param {number} additionalWaves
 * @returns {number}
 */
function getMaxWaves(level, conquerAttack = false, additionalWaves = 0) {
    let waveCount = level >= 51 ? 4 : level >= 26 ? 3 : level >= 13 ? 2 : 1;
    if (conquerAttack) {
        waveCount += 2;
    }
    waveCount += additionalWaves;
    return waveCount;
}

/**
 *
 * @param {BasicBuilding[]} buildings
 * @param {number} type
 */
function getHorseWodId(buildings, type) {
    for (let k in buildings) {
        if (buildings[k].wodId === 214 || buildings[k].wodId === 215 || buildings[k].wodId === 226) {
            let stableInCastle = buildings[k];
            for (let l in buildings) {
                if (parseInt(buildings[l].wodID) === stableInCastle.wodId) {
                    return buildings[l].unlockHorses.split(",")[type];
                }
            }
        }
    }
    return -1;
}

/**
 *
 * @param {Client} client
 * @param {Socket} socket
 * @param {Player} thisPlayer
 * @param {CastleMapobject} castle
 * @param {Lord} lord
 * @returns {void}
 */
async function attackDungeon(client, socket, thisPlayer, castle, lord) {
    return new Promise(async (resolve, reject) => {
        try {
            let dungeon = await getClosestDungeon(client, castle);
            let castleData = await client.getCastleInfo(castle);
            let availableTroops = castleData.troops?.units;
            let availableSoldiers = [];
            let availableDungeonAttackTools = [];
            for (let k in availableTroops) {
                let unit = availableTroops[k].unit;
                if (unit.isSoldier && unit.fightType === 0) {
                    availableSoldiers.push(availableTroops[k]);
                    continue;
                }
                if (unit.fightType === 0 && unit.canBeUsedToAttackNPC && unit.name !== "Eventtool")
                    availableDungeonAttackTools.push(availableTroops[k]);
            }
            if (availableSoldiers.length === 0) return;
            let dungeonProtection = getDungeonProtection(dungeon);
            let {
                attackLowerProtection,
                usedTools
            } = getAttackLowerProtectionDungeon(dungeon, lord, dungeonProtection, availableDungeonAttackTools);
            let defenceStrengthTotal = getDungeonDefenceStrength(dungeon, dungeonProtection, attackLowerProtection, usedTools);
            let army = getBestArmyForDungeon(thisPlayer, dungeon, defenceStrengthTotal, availableSoldiers, lord, usedTools, availableDungeonAttackTools);
            let horseWodId = getHorseWodId(castleData.castle.buildings, 0);
            sendArmyAttackMovement.execute(socket, castle, dungeon, army, lord, horseWodId);
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}