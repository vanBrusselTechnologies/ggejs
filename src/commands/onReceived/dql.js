const {dailyactivities} = require('e4k-data').data;
const Horse = require('../../structures/Horse');
const MovementManager = require('../../managers/MovementManager');
const {HorseType, WorldMapArea, SpyType} = require("../../utils/Constants");

module.exports.name = "dql";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{PQL: number, RDQ:{QID:number, P:[number]}[], FDQ: number[], RS: [string,number|number[]][][]}} params
 */
module.exports.execute = async function (client, errorCode, params) {
    if (!params) return;
    try {
        /** @type {Player} */
        const thisPlayer = await client.players.getThisPlayer();
        if (!thisPlayer) return await require('./dql').execute(client, errorCode, params);
        /** @type {CastleMapobject} */
        const myMainCastle = thisPlayer.castles.find(x => x.areaType === WorldMapArea.MainCastle);
        for (const quest of params.RDQ) {
            const dailyActivity = dailyactivities.find(da => da.dailyQuestID === quest?.QID);
            if (dailyActivity === undefined) continue;
            try {
                switch (quest.QID) {
                    case 1:
                        client._socket["dailySpyAt"] = -1;
                        client._socket["dailySabotageAt"] = -1;
                        client._socket["dailyGoodsTravelTryCount"] = 0;
                        await client.socketManager.reconnect();
                        break; //_login;
                    case 2:
                        /** @type {Castle} */
                        const mainCastleInfo = await client.getCastleInfo(myMainCastle);
                        const dungeon = await getClosestDungeon(client, myMainCastle, false);
                        const horse = new Horse(mainCastleInfo, HorseType.Ruby_1);
                        client.movements.startSpyMovement(myMainCastle, dungeon, 1, SpyType.Military, 50, horse);
                        break; //spendC2
                    case 3:
                        break; //collectTax
                    case 4:
                        if (!client._socket["dailyGoodsTravelTryCount"]) client._socket["dailyGoodsTravelTryCount"] = 0;
                        /** @type {[string, number][]} */
                        const goods = [["W", 1], ["S", 1], ["F", 1]];
                        /** @type {WorldMapSector} */
                        const sector = await client.worldMaps.getSector(myMainCastle.kingdomId, myMainCastle.position.X, myMainCastle.position.Y);
                        const travelTargetCastles = sector.mapObjects.filter(o => o.ownerInfo !== undefined && o.ownerInfo?.playerId > 0 && o.ownerInfo.playerId !== thisPlayer.playerId && !o.ownerInfo.isRuin && (o.areaType === 1 || o.areaType === 4));
                        if (travelTargetCastles.length === 0) break;
                        const travelTargetCastle = travelTargetCastles.sort((a, b) => {
                            return MovementManager.getDistance(myMainCastle, a) - MovementManager.getDistance(myMainCastle, b)
                        })[client._socket["dailyGoodsTravelTryCount"]];
                        client.movements.startMarketMovement(myMainCastle, travelTargetCastle, goods);
                        client._socket["dailyGoodsTravelTryCount"] += 1;
                        break; //resourceToPlayer
                    case 5:
                        if (client.clientUserData.maxSpies <= 1) break;
                        if (client._socket["dailySpyAt"] === quest.P && client._socket["dailySpyTime"] + 1800000 >= Date.now()) break;
                        const d = await getClosestDungeon(client, myMainCastle, false);
                        client.movements.startSpyMovement(myMainCastle, d, Math.round(client.clientUserData.maxSpies / 4), SpyType.Military, 50);
                        client._socket["dailySpyAt"] = quest.P;
                        client._socket["dailySpyTime"] = Date.now();
                        break; //spy
                    case 6:
                        try {
                            if (client._socket["inDQL_q6"]) return;
                            client._socket["inDQL_q6"] = true;
                            const closestRuinsOutpost = getClosestRuinsOutpost(client, await client.worldMaps.get(0), myMainCastle);
                            if (client._socket["dailySabotageAt"] !== quest.P || client._socket["dailySabotageTime"] + 1800000 < Date.now()) {
                                client.movements.startSpyMovement(myMainCastle, closestRuinsOutpost, Math.round(client.clientUserData.maxSpies / 4), SpyType.Sabotage, 10);
                                client._socket["dailySabotageAt"] = quest.P;
                                client._socket["dailySabotageTime"] = Date.now();
                            }
                            delete client._socket["inDQL_q6"];
                        } catch (e) {
                            delete client._socket["inDQL_q6"];
                        }
                        break; //sabotageDamage
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 24:
                        const myCastle = dailyActivity.triggerKingdomID === 0 || quest.QID === 24 ? myMainCastle : thisPlayer.castles.find(x => x.kingdomId === dailyActivity.triggerKingdomID && x.areaType === WorldMapArea.KingdomCastle);
                        if (myCastle == null) break;
                        const lord = client.equipments.getAvailableCommandants()[0];
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
                        client.logger.d('[DQL]', "Unknown Daily Activity Quest!", quest);
                }
            } catch (e) {
                if (e.message === "Client disconnected!") return;
                if (e.message?.startsWith("Exceeded max time")) continue;
                client.logger.d('[DQL]', quest.QID, e);
            }
        }
    } catch (e) {
        client.logger.d('[DQL]', e);
    }
}


/**
 * @param {BaseClient} client
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
    });
    ClassicMap = null;
    ruinedPlayerOutposts.sort((a, b) => {
        const distanceA = MovementManager.getDistance(myMainCastle, a);
        const distanceB = MovementManager.getDistance(myMainCastle, b);
        return distanceA - distanceB;
    });
    if (ruinedPlayerOutposts.length === 0) throw "No target found!";
    return ruinedPlayerOutposts[0];
}

/**
 * @param {BaseClient} client
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
    });
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
 * @param {BaseClient} client
 * @param {Player} thisPlayer
 * @param {CastleMapobject} castle
 * @param {Lord} lord
 * @returns {Promise<void>}
 */
async function attackDungeon(client, thisPlayer, castle, lord) {
    // Disabled
}