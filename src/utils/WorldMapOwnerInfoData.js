const Constants = require("../utils/Constants");
const WorldMapOwnerInfo = require("../structures/WorldMapOwnerInfo");
const EmpireError = require("../tools/EmpireError");

class WorldMapOwnerInfoData {
    /** @type {BaseClient} */
    #client;

    isInitialized = false;

    /**
     * @type {{[id: number]: WorldMapOwnerInfo}}
     * @private
     */
    _ownerInfo = {};

    /** @param {BaseClient} client */
    constructor(client) {
        this.#client = client;
        this._ownInfo = new WorldMapOwnerInfo(client);
    }

    /**
     * @type {WorldMapOwnerInfo}
     * @private
     */
    _ownInfo;

    get ownInfo() {
        const userData = this.#client.clientUserData._userData;
        const playerInfoModel = this.#client.clientUserData._playerInfo;
        const allianceData = this.#client.clientUserData._allianceData;
        const titlesData = this.#client.clientUserData._titlesData;
        const mightData = this.#client.clientUserData._mightData;
        const vipData = this.#client.clientUserData._vipData;

        /** @type {number[][]} */
        const castles = [];
        /** @type {CastleMapobject} */
        const homeCastle = this.#client.clientUserData._userData.castleList.castles["0"]?.find(c => c.areaType === Constants.WorldMapArea.MainCastle);
        if (homeCastle) {
            castles.push([homeCastle.kingdomId, homeCastle.objectId, homeCastle.position.X, homeCastle.position.Y, homeCastle.areaType]);
            const castleKingdomList = this.#client.clientUserData.castles;
            for (const kingdomId in castleKingdomList) {
                for (/** @type {CastleMapobject | CapitalMapobject}*/const castle of castleKingdomList[kingdomId]) {
                    if (castle.objectId !== homeCastle.objectId) {
                        castles.push([castle.kingdomId, castle.objectId, castle.position.X, castle.position.Y, castle.areaType]);
                    }
                }
            }
        }
        const publicVillages = this.#client.clientUserData._userData.castleList.publicVillages.map(pv => pv.village);
        const villages = publicVillages.map(v => [v.kingdomId, v.objectId, v.position.X, v.position.Y]);
        const crestParams = userData.playerCrest != null ? userData.playerCrest.getParamObject() : null;
        const showVIPFlag = vipData.showVIPFlagOnCastle;
        const titlePrefix/* TODO :TitleVO*/ = this.#client.clientUserData.titlePrefix;
        const titleSuffix/* TODO :TitleVO*/ = this.#client.clientUserData.titleSuffix;
        const params = {
            "PF": userData.hasPremiumFlag ? 1 : 0,
            "OID": playerInfoModel.playerId,
            "N": playerInfoModel.userName,
            "E": crestParams,
            "L": userData.userLevel,
            "LL": userData.userParagonLevel,
            "H": userData.userHonor,
            "PA": userData.userActivityPoints,
            "BA": 0,
            "AID": userData.allianceId,
            "AR": userData.allianceRank,
            "AN": allianceData.myAlliance?.allianceName ?? "",
            "ACF": userData.allianceCurrentFame,
            "AP": castles,
            "VP": villages,
            "CF": titlesData.titlePoints[Constants.TitleType.FAME],
            "VF": showVIPFlag ? 1 : 0,
            "SA": userData.isSearchingAlliance ? 1 : 0,
            "MP": mightData.might,
            // TODO: "PRE": titlePrefix.titleID,
            // TODO: "SUF": titleSuffix.titleID
        };
        this._ownInfo.fillFromParamObject(params);
        // TODO: const title = titlesData.currentTitle[Constants.TitleType.ISLE] ?? new TitleVO();
        //  this._ownInfo.titleVO = isleTitleHelper.getTitleVOByTitleId(title.titleID);
        return this._ownInfo;
    }

    /** @param {number} kID */
    getKingdomDungeonOwnerByKingdomId = (kID) => this.getOwnerInfo(-219 - kID);

    /** @param {number} kID */
    getKingdomBossDungeonOwnerByKingdomId = (kID) => this.getOwnerInfo(-229 - kID);

    /** @param {number} ownerId */
    getOwnerInfo = (ownerId) => this.getOwnerInfoInternal(ownerId, true);

    /**
     * @param {number} ownerId
     * @param {Boolean} warnIfNotExisted
     * @private
     */
    getOwnerInfoInternal(ownerId, warnIfNotExisted = false) {
        const ownerInfo = ownerId === this.#client.clientUserData.playerId ? this._ownInfo : this._ownerInfo[ownerId];
        if (!ownerInfo && warnIfNotExisted) {
            this.#client.logger.w(new EmpireError(this.#client, `No owner info (id: ${ownerId})`));
        }
        return ownerInfo;
    }

    /** @param {WorldMapOwnerInfo} ownerInfoVO */
    addOwnerInfo = (ownerInfoVO) => this._ownerInfo[ownerInfoVO.playerId] = ownerInfoVO;

    /** @param {Object} ownerInfo */
    parseOwnerInfo(ownerInfo) {
        if (!ownerInfo || !ownerInfo.OID) return null;
        const ownerId = ownerInfo.OID;
        let wmOwnerInfo = this.getOwnerInfoInternal(ownerId, false);
        if (ownerInfo.DUM) {
            if (!wmOwnerInfo) {
                wmOwnerInfo = new WorldMapOwnerInfo(this.#client);
                wmOwnerInfo.playerId = ownerId;
                wmOwnerInfo.dummyFill();
                this.addOwnerInfo(wmOwnerInfo);
            }
            return wmOwnerInfo;
        }
        const isNPCPlayer = ownerId < 0// todo playerDataService.isNPCPlayer(ownerId);
        if (isNPCPlayer) return null;
        if (!wmOwnerInfo) {
            wmOwnerInfo = new WorldMapOwnerInfo(this.#client);
            wmOwnerInfo.fillFromParamObject(ownerInfo);
            this.addOwnerInfo(wmOwnerInfo);
        } else {
            wmOwnerInfo.fillFromParamObject(ownerInfo);
        }
        if (this._ownInfo && ownerId === this._ownInfo.playerId) {
            this.#client.clientUserData.allianceRank = parseInt(ownerInfo.AR);
        }
        this.setTitleForOwnerInfo(wmOwnerInfo, ownerInfo.TI);
        return wmOwnerInfo;
    }

    /** @param {Array} ownerInfoArray */
    parseOwnerInfoArray(ownerInfoArray) {
        if (!ownerInfoArray) return;
        for (const ownerInfo of ownerInfoArray) this.parseOwnerInfo(ownerInfo);
    }

    /**
     * @param {WorldMapOwnerInfo} ownerInfo
     * @param {number} titleId
     * @private
     */
    setTitleForOwnerInfo(ownerInfo, titleId) {
        // todo if (titleId !== -1) ownerInfo.titleVO = isleTitleHelper.getTitleVOByTitleId(titleId);
    }
}

module.exports = WorldMapOwnerInfoData