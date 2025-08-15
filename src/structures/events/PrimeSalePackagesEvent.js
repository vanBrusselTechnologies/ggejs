const {Package} = require('e4k-data');
const PrimeSaleEvent = require("./PrimeSaleEvent");

class PrimeSalePackagesEvent extends PrimeSaleEvent {
    /** @type {number} */
    skinId;

    /**
     * @param {BaseClient} client
     * @param {{EID:number, RS: number, DIS:number, PID: number[], T: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);

        data.PID.forEach(v => this._addEventPackageById(v));

        parsePrimeSaleTypeAndRequiredEventIds(this)
    }

    get offersHubType() {
        return {name: "primeSalePackages", id: 9}// TODO: OffersHubTypeEnum.PRIME_SALE_PACKAGES;
    }
}

/** @param {PrimeSalePackagesEvent} event */
function parsePrimeSaleTypeAndRequiredEventIds(event) {
    let primeSaleType = getPrimeSaleType(event);
    let eventIds = [];
    if (primeSaleType === "wheel_of_fortune"/*PrimeSaleTypeEnum.WHEEL_OF_FORTUNE*/) {
        eventIds.push(15);
    } else if (primeSaleType === "merchant"/*PrimeSaleTypeEnum.MERCHANT*/ || primeSaleType === "shapeshifter_charm_booster"/*PrimeSaleTypeEnum.SHAPESHIFTER_CHARM_BOOSTER*/) {
        eventIds = getRequiredEventIds(event);
        if (eventIds.length === 0) {
            primeSaleType = "no_prime_sale"/*PrimeSaleTypeEnum.NO_PRIME_SALE*/;
        }
    }
    event.primeSaleType = primeSaleType;
    event.requiredEventIds = eventIds;
}

/**
 * @param {PrimeSalePackagesEvent} event
 * @return {string} todo: PrimeSaleTypeEnum
 */
function getPrimeSaleType(event) {
    const eventPackage = event.eventPackages[0];
    if (eventPackage.packageType === "tickets"/*PackageTypeEnum.LUCKY_WHEEL_TICKETS*/) return "wheel_of_fortune"//PrimeSaleTypeEnum.WHEEL_OF_FORTUNE;
    if (eventPackage.packageType === "VIP"/*PackageTypeEnum.VIP*/) return getPrimeSaleTypeForVIPPrimeSale(event.eventPackages);
    return "merchant"//PrimeSaleTypeEnum.MERCHANT;

}

/**
 * @param {Package[]} eventPackages
 * @return {string} todo: PrimeSaleTypeEnum
 */
function getPrimeSaleTypeForVIPPrimeSale(eventPackages) {
    let includesVipPoints = false;
    let includesVipTime = false;
    for (const eventPackage of eventPackages) {
        if (eventPackage.vipPoints > 0) includesVipPoints = true;
        if (eventPackage.vipTime > 0) includesVipTime = true;
        /*if (eventPackage.goodsAdd.getValue(GameAssetEnumerator.VIP_POINTS) > 0) {
            includesVipPoints = true;
        } else if (eventPackage.goodsAdd.getValue(GameAssetEnumerator.VIP_TIME) > 0) {
            includesVipTime = true;
        }*/
    }
    if (includesVipPoints && includesVipTime) return "vip_points_time"//PrimeSaleTypeEnum.VIP_POINTS_TIME;
    if (includesVipPoints) return "vip_points"//PrimeSaleTypeEnum.VIP_POINTS;
    if (includesVipTime) return "vip_time"//PrimeSaleTypeEnum.VIP_TIME;
    return "no_prime_sale"//PrimeSaleTypeEnum.NO_PRIME_SALE;
}

/**
 * @param {PrimeSalePackagesEvent} primeSalePackagesEvent
 * @return {number[]}
 */
function getRequiredEventIds(primeSalePackagesEvent) {
    const requiredEventIds = [];
    /* TODO:
        const packageId = primeSalePackagesEvent.eventPackages[0].packageID;
        for (const runningEvent of specialEventData.runningEvents) {
            if (runningEvent.eventId !== primeSalePackagesEvent.eventId && SpecialEventUtils.eventHasPackageId(runningEvent, packageId)) {
                requiredEventIds.push(runningEvent.eventId);
            }
        }
    */
    return requiredEventIds;
}

module.exports = PrimeSalePackagesEvent;