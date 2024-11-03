const Constants = require("../utils/Constants");
const WorldmapOwnerInfo = require("../structures/WorldmapOwnerInfo");

class WorldMapOwnerInfoData {
    /** @type {Client} */
    #client;

    isInitialized = false;

    /**
     * @type {{[id: number]: WorldmapOwnerInfo}}
     * @private
     */
    _ownerInfo = {};

    /**
     * @type {WorldmapOwnerInfo}
     * @private
     */
    _ownInfo;

    /** @param {Client} client */
    constructor(client) {
        this.#client = client;
        this._ownInfo = new WorldmapOwnerInfo(client);
    }

    /**
     * @param {number} kID
     * @returns {WorldmapOwnerInfo}
     */
    getKingdomDungeonOwnerByKingdomId(kID) {
        return this.getOwnerInfo(-219 - kID);
    }

    /**
     * @param {number} kID
     * @returns {WorldmapOwnerInfo}
     */
    getKingdomBossDungeonOwnerByKingdomId(kID) {
        return this.getOwnerInfo(-229 - kID);
    }

    /** @returns {WorldmapOwnerInfo} */
    get ownInfo() {
        const userData = this.#client.clientUserData._userData
        const playerInfoModel = this.#client.clientUserData._playerInfo
        const allianceData = this.#client.clientUserData._allianceData
        const titlesData = this.#client.clientUserData._titlesData
        const mightData = this.#client.clientUserData._mightData
        const vipData = this.#client.clientUserData._vipData

        /** @type {number[][]} */
        const castles = [];
        /** @type {CastleMapobject} */
        const homeCastle = this.#client.clientUserData._userData.castleList.castles["0"]?.find(c => c.areaType === Constants.WorldmapArea.MainCastle)
        if (homeCastle) {
            castles.push([homeCastle.kingdomId, homeCastle.objectId, homeCastle.position.X, homeCastle.position.Y, homeCastle.areaType]);
            const castleKingdomList = this.#client.clientUserData.castles
            for (const kingdomId in castleKingdomList) {
                for (/** @type {CastleMapobject | CapitalMapobject}*/const castle of castleKingdomList[kingdomId]) {
                    if (castle.objectId !== homeCastle.objectId) {
                        castles.push([castle.kingdomId, castle.objectId, castle.position.X, castle.position.Y, castle.areaType]);
                    }
                }
            }
        }
        /** @type {number[][]} */
        const villages = [];
        const publicVillages = this.#client.clientUserData._userData.castleList.publicVillages.map(pv => pv.village);
        /*if (kingdomData && kingdomData.activeKingdomId !== 0 && publicVillages.length > 0) {
            for (const village of publicVillages) {
                villages.push([village.kingdomId, village.objectId, village.position.X, village.position.Y]);
            }
        }*/
        const crestParams = userData.playerCrest != null ? userData.playerCrest.getParamObject() : null;
        const showVIPFlag = vipData.showVIPFlagOnCastle;
        const titlePrefix/*:TitleVO*/ = this.#client.clientUserData.titlePrefix;
        const titleSuffix/*:TitleVO*/ = this.#client.clientUserData.titleSuffix;
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
            "MP": mightData.might, //"PRE": titlePrefix.titleID,
            //"SUF": titleSuffix.titleID
        };
        this._ownInfo.fillFromParamObject(params);
        //const title = titlesData.currentTitle[Constants.TitleType.ISLE] ?? new TitleVO();
        //this._ownInfo.titleVO = isleTitleHelper.getTitleVOByTitleId(title.titleID);
        return this._ownInfo;
    }

    /**
     *
     * @param {number} ownerId
     * @returns {WorldmapOwnerInfo}
     */
    getOwnerInfo(ownerId) {
        return this.getOwnerInfoInternal(ownerId, true);
    }

    /**
     *
     * @param {number} ownerId
     * @param {Boolean} warnIfNotExisted
     * @returns {WorldmapOwnerInfo}
     * @private
     */
    getOwnerInfoInternal(ownerId, warnIfNotExisted = false) {
        const ownerInfo = ownerId === this.#client.clientUserData.playerId ? this._ownInfo : this._ownerInfo[ownerId];
        if (!ownerInfo && warnIfNotExisted) {
            console.warn(`No owner info (id: ${ownerId})`);
        }
        return ownerInfo;
    }

    /** @param {WorldmapOwnerInfo} ownerInfoVO */
    addOwnerInfo(ownerInfoVO) {
        this._ownerInfo[ownerInfoVO.playerId] = ownerInfoVO;
    }

    /**
     *
     * @param {Object} ownerInfo
     * @returns {WorldmapOwnerInfo}
     */
    parseOwnerInfo(ownerInfo) {
        if (!ownerInfo || !ownerInfo.OID) {
            return null;
        }
        const ownerId = ownerInfo.OID;
        let wmOwnerInfo = this.getOwnerInfoInternal(ownerId, false);
        if (ownerInfo.DUM) {
            if (!wmOwnerInfo) {
                wmOwnerInfo = new WorldmapOwnerInfo(this.#client);
                wmOwnerInfo.playerId = ownerId;
                wmOwnerInfo.dummyFill();
                this.addOwnerInfo(wmOwnerInfo);
            }
            return wmOwnerInfo;
        }
        const isNPCPlayer = ownerId < 0// todo playerDataService.isNPCPlayer(ownerId);
        if (isNPCPlayer) {
            return null;
        }
        if (!wmOwnerInfo) {
            wmOwnerInfo = new WorldmapOwnerInfo(this.#client);
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
     *
     * @param {WorldmapOwnerInfo} ownerInfo
     * @param {number} titleId
     * @private
     */
    setTitleForOwnerInfo(ownerInfo, titleId) {
        // todo if(titleId !== -1) ownerInfo.titleVO = isleTitleHelper.getTitleVOByTitleId(titleId);
    }
}

module.exports = WorldMapOwnerInfoData