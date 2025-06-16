const EventConst = require("../../utils/EventConst");
const ActiveEvent = require("../../structures/events/ActiveEvent");
const AllianceBattleGroundEvent = require("../../structures/events/AllianceBattleGroundEvent");
const FactionEvent = require("../../structures/events/FactionEvent");
const EquipmentMerchantEvent = require("../../structures/events/EquipmentMerchantEvent");
const MobileBrowserShopStandardEvent = require("../../structures/events/MobileBrowserShopStandardEvent");
const MobileBrowserShopSpecialEvent = require("../../structures/events/MobileBrowserShopSpecialEvent");
const WebshopEvent = require("../../structures/events/WebshopEvent");
const TechnicusEvent = require("../../structures/events/TechnicusEvent");
const PointEvent = require("../../structures/events/PointEvent");
const ResourceMerchantEvent = require("../../structures/events/ResourceMerchantEvent");
const RatingEvent = require("../../structures/events/RatingEvent");
const ArtifactEvent = require("../../structures/events/ArtifactEvent");
const ShoppingCartEvent = require("../../structures/events/ShoppingCartEvent");
const ArmorerEvent = require("../../structures/events/ArmorerEvent");
const FactionUnitDealerEvent = require("../../structures/events/FactionUnitDealerEvent");
const IslandUnitDealerEvent = require("../../structures/events/IslandUnitDealerEvent");
const BasicBlacksmithEvent = require("../../structures/events/BasicBlacksmithEvent");
const CollectorShopEvent = require("../../structures/events/CollectorShopEvent");
const CollectorEvent = require("../../structures/events/CollectorEvent");
const PrimeSalePackagesEvent = require("../../structures/events/PrimeSalePackagesEvent");
const PrimeSaleReviveAllEvent = require("../../structures/events/PrimeSaleReviveAllEvent");
const PrimeSaleTechnicusEvent = require("../../structures/events/PrimeSaleTechnicusEvent");
const PrimeSaleBoosterEvent = require("../../structures/events/PrimeSaleBoosterEvent");
const PrimeSaleRelicusEvent = require("../../structures/events/PrimeSaleRelicusEvent");
const PrimeSaleBuildingsEvent = require("../../structures/events/PrimeSaleBuildingsEvent");
const SaleDaysLuckyWheelEvent = require("../../structures/events/SaleDaysLuckyWheelEvent");
const LuckyWheelEvent = require("../../structures/events/LuckyWheelEvent");
const LTPointEvent = require("../../structures/events/LTPointEvent");
const AlienAllianceInvasionEvent = require("../../structures/events/AlienAllianceInvasionEvent");
const GGSGiftEvent = require("../../structures/events/GGSGiftEvent");
const PrimeTimeAllianceEvent = require("../../structures/events/PrimeTimeAllianceEvent");
const GlobalPrimeTimeSkinEvent = require("../../structures/events/GlobalPrimeTimeSkinEvent");
const TempServerEvent = require("../../structures/events/TempServerEvent");
const PrimeDayEvent = require("../../structures/events/PrimeDayEvent");
const BountyhunterEvent = require("../../structures/events/BountyhunterEvent");
const DistrictGachaEvent = require("../../structures/events/DistrictGachaEvent");
const ChristmasGachaEvent = require("../../structures/events/ChristmasGachaEvent");
const RandomDungeonEvent = require("../../structures/events/RandomDungeonEvent");
const GiftMerchantEvent = require("../../structures/events/GiftMerchantEvent");
const DonationEvent = require("../../structures/events/DonationEvent");
const TempServerMultiplierEvent = require("../../structures/events/TempServerMultiplierEvent");
const ColossusVanillaEvent = require("../../structures/events/ColossusVanillaEvent");
const ColossusRiderEvent = require("../../structures/events/ColossusRiderEvent");
const EasterGachaEvent = require("../../structures/events/EasterGachaEvent");
const SummerGachaEvent = require("../../structures/events/SummerGachaEvent");
const AllianceMobilizationEvent = require("../../structures/events/AllianceMobilizationEvent");

module.exports.name = "sei";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params.E || params.E.length === 0) return;
    for (const eventData of params.E) {
        const eventId = eventData.EID;
        const index = client._activeSpecialEvents.map(e => e.eventId).indexOf(eventId)
        if (index === -1) {
            const event = getEventById(client, eventId);
            client._activeSpecialEvents.push(event);
            event.loadFromParamObject(client, eventData);
            if (event.eventId === EventConst.EVENTTYPE_GGS_GIFT) {
                // TODO:
                //  event.hasBeenCollected = true;
                //  require('../../commands/requestGGSGift').execute(client, 1);
            }
        } else client._activeSpecialEvents[index].loadFromParamObject(client, eventData)
    }
    //TODO: client.events._add_or_update(_events);
}

/**
 * @param {Client} client
 * @param {number} eventId
 * @return {ActiveEvent}
 */
function getEventById(client, eventId) {
    switch (eventId) {
        case EventConst.EVENTTYPE_ALIEN_INVASION_ALLIANCE:
            return new AlienAllianceInvasionEvent();
        case EventConst.EVENTTYPE_FACTION:
            return new FactionEvent();
        case EventConst.EVENTTYPE_LONGTERM_POINT_EVENT:
            return new LTPointEvent();
        case EventConst.EVENTTYPE_TEMPSERVER:
            return new TempServerEvent();
        case EventConst.EVENTTYPE_TEMPSERVER_MULTIPLIER:
            return new TempServerMultiplierEvent();
        case EventConst.EVENTTYPE_ALLIANCE_BATTLEGROUND:
            return new AllianceBattleGroundEvent();
        case EventConst.EVENTTYPE_ARMORER:
            return new ArmorerEvent();
        case EventConst.EVENTTYPE_DUNGEON:
            return new RandomDungeonEvent();
        case EventConst.EVENTTYPE_BOUNTYHUNTER:
            return new BountyhunterEvent();
        case EventConst.EVENTTYPE_COLOSSUS:
            return new ColossusVanillaEvent();
        case EventConst.EVENTTYPE_HORSE_COLOSSUS:
            return new ColossusRiderEvent();
        case EventConst.EVENTTYPE_EQUIPMENTMERCHANT:
            return new EquipmentMerchantEvent();
        case EventConst.EVENTTYPE_ENCHANTER:
            return new TechnicusEvent();
        case EventConst.EVENTTYPE_GIFT_TRADER:
            return new GiftMerchantEvent();
        case EventConst.EVENTTYPE_DONATION:
            return new DonationEvent();
        case EventConst.EVENTTYPE_MERCHANT:
        case EventConst.EVENTTYPE_MERCHANT_FACTION:
            return new ResourceMerchantEvent();
        case EventConst.EVENTTYPE_UNITDEALER_BERIMOND:
            return new FactionUnitDealerEvent();
        case EventConst.EVENTTYPE_UNITDEALER_ISLAND:
            return new IslandUnitDealerEvent();
        case EventConst.EVENTTYPE_APPRENTICE_BLACKSMITH:
        case EventConst.EVENTTYPE_APPRENTICE_TOKEN_VENDOR:
            return new BasicBlacksmithEvent();
        case EventConst.EVENTTYPE_COLLECTOR:
            return new CollectorEvent();
        case EventConst.EVENTTYPE_COLLECTOR_SHOP:
            return new CollectorShopEvent();
        case EventConst.EVENTTYPE_ARTIFACT2:
        case EventConst.EVENTTYPE_ARTIFACT_ICECREAM:
        case EventConst.EVENTTYPE_ARTIFACT_DESSERT:
        case EventConst.EVENTTYPE_ARTIFACT_VOLCANO:
            return new ArtifactEvent();
        case EventConst.EVENTTYPE_POINT_EVENT:
            return new PointEvent();
        case EventConst.EVENTTYPE_DECO_GACHA:
            return new DistrictGachaEvent();
        case EventConst.EVENTTYPE_CHRISTMAS_GACHA:
            return new ChristmasGachaEvent();
        case EventConst.EVENTTYPE_EASTER_GACHA:
            return new EasterGachaEvent();
        case EventConst.EVENTTYPE_SUMMER_GACHA:
            return new SummerGachaEvent();
        case EventConst.EVENTTYPE_RATINGEVENT:
            return new RatingEvent();
        case EventConst.EVENTTYPE_LUCKYWHEEL:
            return new LuckyWheelEvent();
        case EventConst.EVENTTYPE_LUCKYWHEEL_SD:
            return new SaleDaysLuckyWheelEvent();
        case EventConst.EVENTTYPE_PAYMENTREWARD_SPECIAL_OFFER:
        case EventConst.EVENTTYPE_REACTIVATION_PRIME_DAY:
            return new PrimeDayEvent();
        case EventConst.EVENTTYPE_PRIME_SALES:
            return new PrimeSaleBuildingsEvent();
        case EventConst.EVENTTYPE_EVENT_PACKAGE_PRIME_SALES:
            return new PrimeSalePackagesEvent();
        case EventConst.EVENTTYPE_EVENT_BOOSTER_PRIME_SALE:
            return new PrimeSaleBoosterEvent();
        case EventConst.EVENTTYPE_PRIME_SALES_REVIVE_ALL:
            return new PrimeSaleReviveAllEvent();
        case EventConst.EVENTTYPE_PRIME_SALES_TECHNICUS:
            return new PrimeSaleTechnicusEvent();
        case EventConst.EVENTTYPE_PRIME_SALES_RELIC_ENCHANTER:
            return new PrimeSaleRelicusEvent();
        case EventConst.EVENTTYPE_SHOPPING_CART_PRIMEDAY:
            return new ShoppingCartEvent();
        case EventConst.EVENTTYPE_ALLIPAYMENT:
            return new PrimeTimeAllianceEvent()
        case EventConst.EVENTTYPE_PRIME_TIME_SKIN:
            return new GlobalPrimeTimeSkinEvent()
        case EventConst.EVENTTYPE_WEBSHOP:
            return new WebshopEvent();
        case EventConst.EVENTTYPE_MOBILE_BROWSER_SHOP_STANDARD:
        case EventConst.EVENTTYPE_MOBILE_BROWSER_SHOP_TEMPSERVER_STANDARD:
            return new MobileBrowserShopStandardEvent();
        case EventConst.EVENTTYPE_MOBILE_BROWSER_SHOP_SPECIAL:
        case EventConst.EVENTTYPE_MOBILE_BROWSER_SHOP_TEMPSERVER_SPECIAL:
            return new MobileBrowserShopSpecialEvent();
        case EventConst.EVENTTYPE_GGS_GIFT:
            return new GGSGiftEvent();
        case 129: //TODO move to EventConst
            return new AllianceMobilizationEvent()
        case EventConst.EVENTTYPE_COIN_COLOSSUS:
        case EventConst.EVENTTYPE_PRIVATE_PRIME_TIME_EVENT:
        case EventConst.EVENTTYPE_UNIT_PRIME_SALE:
        case EventConst.EVENTTYPE_SPECIAL_DAILY_BUNDLE:
            return new ActiveEvent(); // Those are not in source code
        default:
            if (!client._activeSpecialEvents.map(e => e.eventId).includes(eventId)) client.logger.d(`[SEI] Current event (eventId ${eventId}) isn't fully supported!`);
            return new ActiveEvent();
    }
}