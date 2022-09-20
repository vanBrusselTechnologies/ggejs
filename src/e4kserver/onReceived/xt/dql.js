const Worldmap = require("./../../../structures/Worldmap");
const Client = require("./../../../Client");
const dailyActivities = require("./../../../data/ingame_data/dailyactivities.json");
const Constants = require("./../../../utils/Constants");
const sendSpyMovement = require("./../../commands/sendSpyMovement");
const sendMarketMovement = require("./../../commands/sendMarketMovement");
const buildings = require("./../../../data/ingame_data/buildings.json");
const Lord = require("./../../../structures/Lord");
const sendArmyAttackMovement = require("./../../commands/sendArmyAttackMovement");

module.exports = {
    name: "dql",
    /**
     * 
     * @param {number} errorCode
     * @param {object} params
     */
    async execute(socket, errorCode, params) {
        if (!params) return;
        /** @type {Client} */
        let client = socket.client;
        try {
            let thisPlayer = await client.players.getThisPlayer();
            if (!thisPlayer) { this.execute(socket, errorCode, params); return; }
            let myMainCastle = thisPlayer.castles.find(x => x.areaType === 1);
            /**@type {Worldmap} */
            let ClassicMap = await client.worldmaps.get(0);
            const closestRuinsOutpost = await getClosestRuinsOutpost(client, ClassicMap, myMainCastle);
            const closestDungeonClassicMap = await getClosestDungeon(client, myMainCastle);
            const mainCastleInfo = await client.getCastleInfo(myMainCastle);
            for (let i in params.RDQ) {
                let quest = params.RDQ[i];
                for (let j in dailyActivities) {
                    if (parseInt(dailyActivities[j].dailyQuestID) === quest?.QID) {
                        switch (quest.QID) {
                            case 1:
                                try {
                                    socket["dailySpyAt"] = -1;
                                    socket["dailySaboAt"] = -1;
                                    socket["dailyGoodsTravelTryCount"] = 0;
                                    await client.__x__x__relogin();
                                }
                                catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //login;
                            case 2:
                                try {
                                    let areaData = mainCastleInfo;
                                    let _foundBuildings = areaData.castle.buildings;
                                    let horseWodId = -1;
                                    for (let k in _foundBuildings) {
                                        if (_foundBuildings[k].wodId === 214 || _foundBuildings[k].wodId === 215 || _foundBuildings[k].wodId === 226) {
                                            let stableInCastle = _foundBuildings[k];
                                            for (let l in buildings) {
                                                if (buildings[l].wodID == stableInCastle.wodId) {
                                                    horseWodId = buildings[l].unlockHorses.split(",")[1];
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    sendSpyMovement.execute(socket, myMainCastle, closestDungeonClassicMap, 1, 0, 50, horseWodId);
                                }
                                catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //spendC2
                            case 3: break; //collectTax
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
                                if (socket["dailySaboAt"] !== quest.P || socket["dailySaboTime"] + 1800000 < Date.now()) {
                                    sendSpyMovement.execute(socket, myMainCastle, closestRuinsOutpost, Math.round(client["maxSpies"] / 4), 2, 10);
                                    socket["dailySaboAt"] = quest.P;
                                    socket["dailySaboTime"] = Date.now();
                                }
                                break; //sabotageDamage
                            case 7:
                                break;
                                try {
                                    let lord = socket["generals"][0];
                                    let castleData = mainCastleInfo;
                                    let availableTroops = castleData.troops?.units;
                                    let availableSoldiers = [];
                                    let availableDungeonAttackTools = [];
                                    for (let k in availableTroops) {
                                        let unit = availableTroops[k].unit;
                                        const unitData = unit.rawData;
                                        if (unit.isSoldier && unitData.fightType === "0") {
                                            availableSoldiers.push(availableTroops[k]);
                                            continue;
                                        }
                                        if (unitData.fightType === "0" && unitData.canBeUsedToAttackNPC !== "0" && unitData.name !== "Eventtool")
                                            availableDungeonAttackTools.push(availableTroops[k]);
                                    }
                                    let dungeonProtection = getDungeonProtection(closestDungeonClassicMap);
                                    let { attackLowerProtection, usedTools } = getAttackLowerProtectionDungeon(closestDungeonClassicMap, lord, dungeonProtection, availableDungeonAttackTools);
                                    let defenceStrengthTotal = getDungeonDefenceStrength(closestDungeonClassicMap, dungeonProtection, attackLowerProtection);
                                    let army = getBestArmyForDungeon(thisPlayer, closestDungeonClassicMap, defenceStrengthTotal, availableSoldiers, lord, usedTools, availableDungeonAttackTools);
                                    let _foundBuildings = castleData.castle.buildings;
                                    let horseWodId = -1;
                                    for (let k in _foundBuildings) {
                                        if (_foundBuildings[k].wodId === 214 || _foundBuildings[k].wodId === 215 || _foundBuildings[k].wodId === 226) {
                                            let stableInCastle = _foundBuildings[k];
                                            for (let l in buildings) {
                                                if (buildings[l].wodID == stableInCastle.wodId) {
                                                    horseWodId = buildings[l].unlockHorses.split(",")[0];
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    sendArmyAttackMovement.execute(socket, myMainCastle, closestDungeonClassicMap, army, lord, horseWodId);
                                }
                                catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //countDungeons kId=0
                            case 8:
                                break;
                                try {
                                    let myKingdomCastle = thisPlayer.castles.find(x =>
                                        x.kingdomId === 2 &&
                                        x.areaType === Constants.WorldmapArea.KingdomCastle
                                    );
                                    let dungeon = await getClosestDungeon(client, myKingdomCastle);
                                    let lord = socket["generals"][1];
                                    let castleData = await client.getCastleInfo(myKingdomCastle);
                                    let availableTroops = castleData.troops?.units;
                                    let availableSoldiers = [];
                                    let availableDungeonAttackTools = [];
                                    for (let k in availableTroops) {
                                        let unit = availableTroops[k].unit;
                                        const unitData = unit.rawData;
                                        if (unit.isSoldier && unitData.fightType === "0") {
                                            availableSoldiers.push(availableTroops[k]);
                                            continue;
                                        }
                                        if (unitData.fightType === "0" && unitData.canBeUsedToAttackNPC !== "0" && unitData.name !== "Eventtool")
                                            availableDungeonAttackTools.push(availableTroops[k]);
                                    }
                                    let dungeonProtection = getDungeonProtection(dungeon);
                                    let { attackLowerProtection, usedTools } = getAttackLowerProtectionDungeon(dungeon, lord, dungeonProtection, availableDungeonAttackTools);
                                    let defenceStrengthTotal = getDungeonDefenceStrength(dungeon, dungeonProtection, attackLowerProtection);
                                    let army = getBestArmyForDungeon(thisPlayer, dungeon, defenceStrengthTotal, availableSoldiers, lord, usedTools, availableDungeonAttackTools);
                                    let _foundBuildings = castleData.castle.buildings;
                                    let horseWodId = -1;
                                    for (let k in _foundBuildings) {
                                        if (_foundBuildings[k].wodId === 214 || _foundBuildings[k].wodId === 215 || _foundBuildings[k].wodId === 226) {
                                            let stableInCastle = _foundBuildings[k];
                                            for (let l in buildings) {
                                                if (buildings[l].wodID == stableInCastle.wodId) {
                                                    horseWodId = buildings[l].unlockHorses.split(",")[0];
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    sendArmyAttackMovement.execute(socket, myKingdomCastle, dungeon, army, lord, horseWodId);
                                    await client.getCastleInfo(myMainCastle);
                                }
                                catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //countDungeons kId=2
                            case 9:
                                break;
                                try {
                                    let myKingdomCastle = thisPlayer.castles.find(x =>
                                        x.kingdomId === 1 &&
                                        x.areaType === Constants.WorldmapArea.KingdomCastle
                                    );
                                    let dungeon = await getClosestDungeon(client, myKingdomCastle);
                                    let lord = socket["generals"][2];
                                    let castleData = await client.getCastleInfo(myKingdomCastle);
                                    let availableTroops = castleData.troops?.units;
                                    let availableSoldiers = [];
                                    let availableDungeonAttackTools = [];
                                    for (let k in availableTroops) {
                                        let unit = availableTroops[k].unit;
                                        const unitData = unit.rawData;
                                        if (unit.isSoldier && unitData.fightType === "0") {
                                            availableSoldiers.push(availableTroops[k]);
                                            continue;
                                        }
                                        if (unitData.fightType === "0" && unitData.canBeUsedToAttackNPC !== "0" && unitData.name !== "Eventtool")
                                            availableDungeonAttackTools.push(availableTroops[k]);
                                    }
                                    let dungeonProtection = getDungeonProtection(dungeon);
                                    let { attackLowerProtection, usedTools } = getAttackLowerProtectionDungeon(dungeon, lord, dungeonProtection, availableDungeonAttackTools);
                                    let defenceStrengthTotal = getDungeonDefenceStrength(dungeon, dungeonProtection, attackLowerProtection);
                                    let army = getBestArmyForDungeon(thisPlayer, dungeon, defenceStrengthTotal, availableSoldiers, lord, usedTools, availableDungeonAttackTools);
                                    let _foundBuildings = castleData.castle.buildings;
                                    let horseWodId = -1;
                                    for (let k in _foundBuildings) {
                                        if (_foundBuildings[k].wodId === 214 || _foundBuildings[k].wodId === 215 || _foundBuildings[k].wodId === 226) {
                                            let stableInCastle = _foundBuildings[k];
                                            for (let l in buildings) {
                                                if (buildings[l].wodID == stableInCastle.wodId) {
                                                    horseWodId = buildings[l].unlockHorses.split(",")[0];
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    sendArmyAttackMovement.execute(socket, myKingdomCastle, dungeon, army, lord, horseWodId);
                                    await client.getCastleInfo(myMainCastle);
                                }
                                catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //countDungeons kId=1
                            case 10:
                                break;
                                try {
                                    let myKingdomCastle = thisPlayer.castles.find(x =>
                                        x.kingdomId === 3 &&
                                        x.areaType === Constants.WorldmapArea.KingdomCastle
                                    );
                                    let dungeon = await getClosestDungeon(client, myKingdomCastle);
                                    let lord = socket["generals"][3];
                                    let castleData = await client.getCastleInfo(myKingdomCastle);
                                    let availableTroops = castleData.troops?.units;
                                    let availableSoldiers = [];
                                    let availableDungeonAttackTools = [];
                                    for (let k in availableTroops) {
                                        let unit = availableTroops[k].unit;
                                        const unitData = unit.rawData;
                                        if (unit.isSoldier && unitData.fightType === "0") {
                                            availableSoldiers.push(availableTroops[k]);
                                            continue;
                                        }
                                        if (unitData.fightType === "0" && unitData.canBeUsedToAttackNPC !== "0" && unitData.name !== "Eventtool")
                                            availableDungeonAttackTools.push(availableTroops[k]);
                                    }
                                    let dungeonProtection = getDungeonProtection(dungeon);
                                    let { attackLowerProtection, usedTools } = getAttackLowerProtectionDungeon(dungeon, lord, dungeonProtection, availableDungeonAttackTools);
                                    let defenceStrengthTotal = getDungeonDefenceStrength(dungeon, dungeonProtection, attackLowerProtection);
                                    let army = getBestArmyForDungeon(thisPlayer, dungeon, defenceStrengthTotal, availableSoldiers, lord, usedTools, availableDungeonAttackTools);
                                    let _foundBuildings = castleData.castle.buildings;
                                    let horseWodId = -1;
                                    for (let k in _foundBuildings) {
                                        if (_foundBuildings[k].wodId === 214 || _foundBuildings[k].wodId === 215 || _foundBuildings[k].wodId === 226) {
                                            let stableInCastle = _foundBuildings[k];
                                            for (let l in buildings) {
                                                if (buildings[l].wodID == stableInCastle.wodId) {
                                                    horseWodId = buildings[l].unlockHorses.split(",")[0];
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    sendArmyAttackMovement.execute(socket, myKingdomCastle, dungeon, army, lord, horseWodId);
                                    await client.getCastleInfo(myMainCastle);
                                }
                                catch (e) {
                                    if (socket["debug"])
                                        console.log(e);
                                }
                                break; //countDungeons kId=3
                            case 13: break; //craftEquipment
                            case 14: client.sendChatMessage(" "); break; //writeInAllianceChat
                            case 15: break; //collectFromCitizen
                            case 16: break; //recruitUnits
                            case 17: break; //produceTools
                            case 21: break; //requestAllianceHelp
                            case 22: break; //completeMercenaryMission
                            case 24: break; //countDungeons tempServer
                            case 25: break; //countBattles 10 tempServer
                            case 26: break; //countBattles 15 tempServer
                            default: console.log("Unknown Daily Activity Quest!");
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
            for (k in _target.castles) {
                let __castle = _target.castles[k];
                if (__castle.areaType !== Constants.WorldmapArea.Outpost) continue;
                let castleDistance = getDistance(myMainCastle, __castle);
                if (castleDistance < _targetAreaDistance) {
                    targetArea = __castle;
                    _targetAreaDistance = castleDistance;
                }
            }
            resolve(targetArea);
        }
        catch (e) { reject(e); }
    })
}

function getClosestDungeon(client, myKingdomCastle) {
    return new Promise(async (resolve, reject) => {
        try {
            /**@type {Worldmap} */
            let worldmap = await client.worldmaps.get(myKingdomCastle.kingdomId);
            let dungeons = worldmap.mapobjects.filter(x => x.areaType === Constants.WorldmapArea.Dungeon && !x.attackCooldownEnd);
            dungeons.sort((a, b) => {
                let distanceA = getDistance(myKingdomCastle, a);
                let distanceB = getDistance(myKingdomCastle, b);
                return distanceA - distanceB;
            })
            if (dungeons.length === 0) reject("No dungeon found!");
            let targetDungeon = dungeons[0];
            resolve(targetDungeon);
        }
        catch (e) { reject(e); }
    })
}

function getDistance(source, target) {
    return Math.sqrt(Math.pow(source.position.X - target.position.X, 2) + Math.pow(source.position.Y - target.position.Y, 2));
}

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
        if (buildings[j].wodID == dungeon.wallWodId) {
            dungeonWallBaseProtection = parseInt(buildings[j].wallBonus);
            if (dungeonGateBaseProtection != 0) break;
        }
        if (buildings[j].wodID == dungeon.gateWodId) {
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
        }
        else if (__effect.name === "wallBonus") {
            protection.left.wall += __effect.power;
            protection.middle.wall += __effect.power;
            protection.right.wall += __effect.power;
        }
    }
    for (let k in dungeon.defence.tools) {
        for (let l in dungeon.defence.tools[k]) {
            const unitData = dungeon.defence.tools[k][l].unit.rawData;
            //const count = dungeon.defence.tools[k][l].count;
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

function getDungeonDefenceStrength(dungeon, protection, attackLowerProtection) {
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
            const unitData = dungeon.defence.troops[k][l].unit.rawData;
            const count = dungeon.defence.troops[k][l].count;
            defenceStrength[k].range += unitData.rangeDefence * count;
            defenceStrength[k].melee += unitData.meleeDefence * count;
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
            continue;
        }
    }
    for (let k in dungeon.defence.tools) {
        for (let l in dungeon.defence.tools[k]) {
            const unitData = dungeon.defence.tools[k][l].unit.rawData;
            //const count = dungeon.defence.tools[k][l].count;
            if (unitData.fightType === "1") {
                if (unitData.meleeBonus)
                    defenceStrengthBonus[k].melee += parseInt(unitData.meleeBonus);
                else if (unitData.rangeBonus)
                    defenceStrengthBonus[k].range += parseInt(unitData.rangeBonus);
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
 * 
 * @param {Lord} general 
 * @returns 
 */
function getAttackLowerProtectionDungeon(dungeon, general, dungeonProtection, _availableTools) {
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
                                    usedTools[i].push({ tool: _tool, count: _toolUseCount });
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
                                usedTools[i].push({ tool: _tool, count: _toolUseCount });
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
    }
    return { attackLowerProtection, usedTools };
}

function getBestArmyForDungeon(player, dungeon, defenceStrength, availableSoldiers, lord, usedTools, availableTools) {
    let meleeStrength = 0;
    let rangeStrength = 0;
    for (let k in availableSoldiers) {
        let unit = availableSoldiers[k].unit;
        const unitData = unit.rawData;
        let count = availableSoldiers[k].count;
        if (unitData.rangeAttack) {
            rangeStrength += unitData.rangeAttack * count;
        }
        if (unitData.meleeAttack) {
            meleeStrength += unitData.meleeAttack * count;
        }
    }
    let meleeSoldiersSorted = availableSoldiers.filter(x => x.unit.rawData.meleeAttack != undefined).sort((a, b) => -(parseInt(a.unit.rawData.meleeAttack) * a.count - parseInt(b.unit.rawData.meleeAttack) * b.count));
    let rangeSoldiersSorted = availableSoldiers.filter(x => x.unit.rawData.rangeAttack != undefined).sort((a, b) => -(parseInt(a.unit.rawData.rangeAttack) * a.count - parseInt(b.unit.rawData.rangeAttack) * b.count));
    let army = [];
    let waveCount = getMaxWaves(player.playerLevel);
    for (let w = 0; w < waveCount; w++) {
        let wave = { L: { U: [], T: [] }, M: { U: [], T: [] }, R: { U: [], T: [] } }
        for (let i in defenceStrength) {
            let side = i === "left" ? "L" : i === "middle" ? "M" : i === "right" ? "R" : "";
            if (side === "") continue;
            let maxSoldiersOnSide = side === "M" ? getMaxSoldiersMiddle(dungeon.level) : getMaxSoldiersFlank(dungeon.level);
            meleeSoldiersSorted.sort((a, b) => -(parseInt(a.unit.rawData.meleeAttack) * Math.min(a.count, maxSoldiersOnSide) - parseInt(b.unit.rawData.meleeAttack) * Math.min(b.count, maxSoldiersOnSide)));
            rangeSoldiersSorted.sort((a, b) => -(parseInt(a.unit.rawData.rangeAttack) * Math.min(a.count, maxSoldiersOnSide) - parseInt(b.unit.rawData.rangeAttack) * Math.min(b.count, maxSoldiersOnSide)));
            if (defenceStrength[i].melee < defenceStrength[i].range) {
                if (meleeStrength > defenceStrength[i].melee) {
                    let _count = Math.min(maxSoldiersOnSide, meleeSoldiersSorted[0].count);
                    wave[side]["U"].push([meleeSoldiersSorted[0].unit.wodId, _count]);
                    meleeSoldiersSorted[0].count -= _count;
                }
            }
            else if (defenceStrength[i].range < defenceStrength[i].melee) {
                if (rangeStrength > defenceStrength[i].range) {
                    let _count = Math.min(maxSoldiersOnSide, rangeSoldiersSorted[0].count)
                    wave[side]["U"].push([rangeSoldiersSorted[0].unit.wodId, _count]);
                    rangeSoldiersSorted[0].count -= _count;
                }
            }
            else if (defenceStrength[i].melee !== 0) {
                if (defenceStrength["center"].range > defenceStrength["center"].melee) {
                    let _count = Math.min(maxSoldiersOnSide, meleeSoldiersSorted[0].count);
                    wave[side]["U"].push([meleeSoldiersSorted[0].unit.wodId, _count]);
                    meleeSoldiersSorted[0].count -= _count;
                }
                else if (defenceStrength["center"].melee > defenceStrength["center"].range) {
                    let _count = Math.min(maxSoldiersOnSide, rangeSoldiersSorted[0].count)
                    wave[side]["U"].push([rangeSoldiersSorted[0].unit.wodId, _count]);
                    rangeSoldiersSorted[0].count -= _count;
                }
                else {
                    if (rangeSoldiersSorted[0].count > meleeSoldiersSorted[0].count) {
                        let _count = Math.min(maxSoldiersOnSide, rangeSoldiersSorted[0].count)
                        wave[side]["U"].push([rangeSoldiersSorted[0].unit.wodId, _count]);
                        rangeSoldiersSorted[0].count -= _count;
                    }
                    else {
                        let _count = Math.min(maxSoldiersOnSide, meleeSoldiersSorted[0].count);
                        wave[side]["U"].push([meleeSoldiersSorted[0].unit.wodId, _count]);
                        meleeSoldiersSorted[0].count -= _count;
                    }
                }
            }
        }
        for (let i in defenceStrength) {
            if (meleeSoldiersSorted.length === 0 || rangeSoldiersSorted.length === 0) break;
            meleeSoldiersSorted.sort((a, b) => -(parseInt(a.unit.rawData.meleeAttack) * a.count - parseInt(b.unit.rawData.meleeAttack) * b.count));
            rangeSoldiersSorted.sort((a, b) => -(parseInt(a.unit.rawData.rangeAttack) * a.count - parseInt(b.unit.rawData.rangeAttack) * b.count));
            let side = i === "left" ? "L" : i === "middle" ? "M" : i === "right" ? "R" : "";
            if (side === "") continue;
            let maxSoldiersOnSide = side === "M" ? getMaxSoldiersMiddle(dungeon.level) : getMaxSoldiersFlank(dungeon.level);
            if (defenceStrength[i].melee === defenceStrength[i].range && defenceStrength[i].melee === 0) {
                if (defenceStrength["center"].range > defenceStrength["center"].melee) {
                    let _count = Math.min(maxSoldiersOnSide, meleeSoldiersSorted[0].count);
                    wave[side]["U"].push([meleeSoldiersSorted[0].unit.wodId, _count]);
                    meleeSoldiersSorted[0].count -= _count;
                }
                else if (defenceStrength["center"].melee > defenceStrength["center"].range) {
                    let _count = Math.min(maxSoldiersOnSide, rangeSoldiersSorted[0].count)
                    wave[side]["U"].push([rangeSoldiersSorted[0].unit.wodId, _count]);
                    rangeSoldiersSorted[0].count -= _count;
                }
                else {
                    if (rangeSoldiersSorted[0].count > meleeSoldiersSorted[0].count) {
                        let _count = Math.min(maxSoldiersOnSide, rangeSoldiersSorted[0].count)
                        wave[side]["U"].push([rangeSoldiersSorted[0].unit.wodId, _count]);
                        rangeSoldiersSorted[0].count -= _count;
                    }
                    else {
                        let _count = Math.min(maxSoldiersOnSide, meleeSoldiersSorted[0].count);
                        wave[side]["U"].push([meleeSoldiersSorted[0].unit.wodId, _count]);
                        meleeSoldiersSorted[0].count -= _count;
                    }
                }
            }
        }
        if (w === 0) {
            for (let i in wave) {
                if (wave[i]["U"].length > 0) {
                    let j = i === "L" ? "left" : i === "M" ? "middle" : i === "R" ? "right" : "";
                    for (let k in usedTools[j]) {
                        let __tool = usedTools[j][k];
                        wave[i]["T"].push([__tool.tool.wodId, __tool.count]);
                    }

                }
            }
        }
        army.push(wave);
    }
    return army;
}

function getToolBoxesCountMiddle(defenderLevel) {
    if (defenderLevel < 11) return 1;
    if (defenderLevel < 37) return 2;
    return 3
}
function getToolBoxesCountFlank(defenderLevel) {
    if (defenderLevel < 37) return 1;
    return 2;
}
function getMaxToolAmountMiddle(defenderLevel) {
    if (defenderLevel < 11) return 10;
    if (defenderLevel < 37) return 20;
    if (defenderLevel < 50) return 30;
    if (defenderLevel < 69) return 40;
    return 50;
}
function getMaxToolAmountFlank(defenderLevel, toolFlankBonus = 0) {
    if (defenderLevel < 37) return 10;
    if (defenderLevel < 50) return 20;
    if (defenderLevel < 69) return 30;
    return Math.ceil(40 + toolFlankBonus);
}
function getMaxSoldiersMiddle(defenderLevel, soldierFrontBonus = 0) {
    return Math.ceil((getMaxSoldiersPerWave(defenderLevel) - getMaxSoldiersFlank(defenderLevel) * 2) * (1 + soldierFrontBonus / 100))
}
function getMaxSoldiersFlank(defenderLevel, soldierFlankBonus = 0) {
    return Math.ceil(getMaxSoldiersPerWave(defenderLevel) * 0.2 * (1 + soldierFlankBonus / 100))
}
function getMaxSoldiersPerWave(defenderLevel) {
    if (defenderLevel <= 69) return Math.min(260, 5 * defenderLevel + 8);
    return 320;
}
function getMaxWaves(level, conquerAttack = false, additionalWaves = 0) {
    let waveCount = level >= 51 ? 4 : level >= 26 ? 3 : level >= 13 ? 2 : 1;
    if (conquerAttack) {
        waveCount += 2;
    }
    waveCount += additionalWaves;
    return waveCount;
}