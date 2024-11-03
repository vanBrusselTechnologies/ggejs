const CastleMarauderPremiumShop = require("./CastleMarauderPremiumShop");
const CastleTaxCollectorPremiumShop = require("./CastleTaxCollectorPremiumShop");
const CastleInstructorPremiumShop = require("./CastleInstructorPremiumShop");
const CastlePrimeDayBoostWoodPremiumShop = require("./CastlePrimeDayBoostWoodPremiumShop");
const CastlePrimeDayBoostStonePremiumShop = require("./CastlePrimeDayBoostStonePremiumShop");
const CastlePrimeDayBoostFoodPremiumShop = require("./CastlePrimeDayBoostFoodPremiumShop");
const CastlePrimeDayBoostGoldPremiumShop = require("./CastlePrimeDayBoostGoldPremiumShop");
const CastlePersonalGloryBoostShop = require("./CastlePersonalGloryBoostShop");
const KhanTabletBoosterShop = require("./KhanTabletBoosterShop");
const RagePointBoosterShop = require("./RagePointBoosterShop");
const KhanMedalBoosterShop = require("./KhanMedalBoosterShop");
const XPBooster = require("./XPBooster");
const GallantryPointsBooster = require("./GallantryPointsBooster");
const LongTermPointEventBooster = require("./LongTermPointEventBooster");
const SamuraiTokenBoosterShop = require("./SamuraiTokenBoosterShop");
const ResourceOverseerBoosterShop = require("./ResourceOverseerBoosterShop");
const RunningFeast = require("./RunningFeast");

class PremiumBoostData {
    #client;
    /** @type {{[key:number]: Booster}}*/
    _boosterDict = {};
    _activeBoosterDict = {};
    boughtBuildingSlots = 0;
    boughtUnitSlots = 0;
    boughtToolSlots = 0;
    /** @type {{[key:number]: ResourceOverseerBoosterShop}}*/
    _resourceOverseerBoosterMap = {};
    feastCostReduction = 0;

    /** @param {Client} client */
    constructor(client) {
        this.feast = new RunningFeast();

        this._resourceOverseerBoosterMap["F"/*todo: GameAssetEnumerator.FOOD*/] = new ResourceOverseerBoosterShop(client, "food"/*todo: GameAssetEnumerator.FOOD*/, 2, 630);
        this._resourceOverseerBoosterMap["S"/*todo: GameAssetEnumerator.STONE*/] = new ResourceOverseerBoosterShop(client, "stone"/*todo: GameAssetEnumerator.STONE*/, 1, 640);
        this._resourceOverseerBoosterMap["W"/*todo: GameAssetEnumerator.WOOD*/] = new ResourceOverseerBoosterShop(client, "wood"/*todo: GameAssetEnumerator.WOOD*/, 0, 650);
        this._resourceOverseerBoosterMap["HONEY"/*todo: GameAssetEnumerator.HONEY*/] = new ResourceOverseerBoosterShop(client, "honey"/*todo: GameAssetEnumerator.HONEY*/, 3, 651, "honeyResource");
        this._resourceOverseerBoosterMap["MEAD"/*todo: GameAssetEnumerator.MEAD*/] = new ResourceOverseerBoosterShop(client, "mead"/*todo: GameAssetEnumerator.MEAD*/, 4, 652, "meadResource");
        this._resourceOverseerBoosterMap["BEEF"/*todo: GameAssetEnumerator.BEEF*/] = new ResourceOverseerBoosterShop(client, "beef"/*todo: GameAssetEnumerator.BEEF*/, 5, 653, "beefResource", 125, 4900);
        this.marauder = new CastleMarauderPremiumShop(client);
        this.taxBribe = new CastleTaxCollectorPremiumShop(client);
        this.instructor = new CastleInstructorPremiumShop(client);
        //todo this.caravanOverloader = new CastleCaravanOverloaderPremiumShop()
        //todo this.armyReturnSpeedBoosterPremiumShop = new CastleReturnSpeedBoosterPremiumShop();
        this.primeDayWood = new CastlePrimeDayBoostWoodPremiumShop(client);
        this.primeDayStone = new CastlePrimeDayBoostStonePremiumShop(client);
        this.primeDayFood = new CastlePrimeDayBoostFoodPremiumShop(client);
        this.primeDayGold = new CastlePrimeDayBoostGoldPremiumShop(client);
        this.personalGlory = new CastlePersonalGloryBoostShop(client);
        this.khanTabletBooster = new KhanTabletBoosterShop(client);
        this.ragePointBooster = new RagePointBoosterShop(this.#client);
        this.khanMedalBooster = new KhanMedalBoosterShop(this.#client);
        this.xpBooster = new XPBooster(this.#client);
        this.gallantryPointsBooster = new GallantryPointsBooster(this.#client);
        this.longTermPointEventBooster = new LongTermPointEventBooster(this.#client);
        this.samuraiTokenBoosterShop = new SamuraiTokenBoosterShop(this.#client);

        for (const key in this._resourceOverseerBoosterMap) {
            const booster = this._resourceOverseerBoosterMap[key]
            this._boosterDict[booster.id] = booster;
        }
        this._boosterDict[this.marauder.id] = this.marauder;
        this._boosterDict[this.taxBribe.id] = this.taxBribe;
        this._boosterDict[this.instructor.id] = this.instructor;
        //todo  this._boosterDict[this.caravanOverloader.id] = this.caravanOverloader;
        this._boosterDict[this.primeDayWood.id] = this.primeDayWood;
        this._boosterDict[this.primeDayStone.id] = this.primeDayStone;
        this._boosterDict[this.primeDayFood.id] = this.primeDayFood;
        this._boosterDict[this.primeDayGold.id] = this.primeDayGold;
        this._boosterDict[this.personalGlory.id] = this.personalGlory;
        this._boosterDict[this.khanTabletBooster.id] = this.khanTabletBooster;
        this._boosterDict[this.ragePointBooster.id] = this.ragePointBooster;
        this._boosterDict[this.khanMedalBooster.id] = this.khanMedalBooster;
        //todo this._boosterDict[this.armyReturnSpeedBoosterPremiumShop.id] = this.armyReturnSpeedBoosterPremiumShop;
        this._boosterDict[this.xpBooster.id] = this.xpBooster;
        this._boosterDict[this.gallantryPointsBooster.id] = this.gallantryPointsBooster;
        this._boosterDict[this.longTermPointEventBooster.id] = this.longTermPointEventBooster;
        this._boosterDict[this.samuraiTokenBoosterShop.id] = this.samuraiTokenBoosterShop;
    }

    /**
     *
     * @param {number} id
     * @return {Booster}
     */
    getBoosterById(id) {
        return this._boosterDict[id]
    }

    /** @param {HeroBoosterShop} booster */
    removeActiveBooster(booster) {
        delete this._activeBoosterDict[booster.id];
    }

    /** @param {HeroBoosterShop} booster */
    addActiveBooster(booster) {
        this._activeBoosterDict[booster.id] = booster;
    }
}

module.exports = PremiumBoostData