const Crest = require("./Crest");
const Coordinate = require("./Coordinate");
const CastlePosition = require("./CastlePosition");

class WorldmapOwnerInfo {
    /** @type {Client} */
    #client;
    /*
    private static const KINGDOM_ID_INDEX:int = 0;

    private static const OBJECT_ID_INDEX:int = 1;

    private static const X_POS_INDEX:int = 2;

    private static const Y_POS_INDEX:int = 3;

    private static const AREA_TYPE_INDEX:int = 4;
     */

    /** @type {number} */
    playerId = -1;

    /**
     * @type {string}
     * @private
     */
    _playerName = "";

    /** @type {number} */
    playerLevel = -1;

    /** @type {number} */
    paragonLevel = -1;

    /** @type {Crest} */
    crest;

    /** @type {Date} */
    noobEndTime = new Date(0);

    /** @type {Date} */
    peaceEndTime = new Date(0);

    /**
     * @type {number}
     * @private
     */
    _honor = -1;

    /**
     * @type {number}
     * @private
     */
    _famePoints = -1;

    /** @type {number} */
    highestFamePoints = -1;

    /** @type {number} */
    fameTopX = -1

    /**
     * @type {boolean}
     * @private
     */
    _isRuin = false;

    /**
     * @type {number}
     * @private
     */
    _allianceId = -1;

    /**
     * @type {number}
     * @private
     */
    _allianceRank = -1;

    /**
     * @type {string}
     * @private
     */
    _allianceName = "";

    /**
     * @type {number}
     * @private
     */
    _allianceFame = -1;

    /**
     * @type {boolean}
     * @private
     */
    _isSearchingAlliance;

    /** @type {boolean} */
    isOutpostOwner = false;

    /** @type {boolean} */
    isNPC = false;

    /**
     * @type {CastlePosition[]}
     * @private
     */
    _castlePosList = [];

    /**
     * @type {CastlePosition[]}
     * @private
     */
    _villagePosList = [];

    /**
     * @type {boolean}
     * @private
     */
    _hasPremiumFlag = false;

    /**
     * @type {boolean}
     * @private
     */
    _hasVIPFlag = false;

    /**
     * @type {boolean}
     * @private
     */
    _isDummy = false;

    /**
     * @type {number}
     * @private
     */
    _achievementPoints = -1;

    /** @type {Date} */
    relocateDurationEndTime = new Date(0);

    /**
     * @type {number}
     * @private
     */
    _might = -1;

    /** @type {number} */
    factionId = 0;

    /**
     * @type {number}
     * @private
     */
    _factionMainCampId = -1;

    /** @type {number} */
    factionProtectionStatus = -1;

    /** @type {Date} */
    factionProtectionEndTime = new Date(0);

    /** @type {Date} */
    factionNoobProtectionEndTime = new Date(0);

    /** @type {boolean} */
    factionIsSpectator = false;

    /**
     * @type {IsleTitleViewVO}
     * @private
     */
    _titleVO;

    /**
     * @type {GameTickOnlySecondsSignal}
     * @private
     */
    gameTickSignal;

    /**
     * @type {KingdomSkinNamesFactory}
     * @private
     */
    _namesFactory;

    /**
     * @type {string}
     * @private
     */
    _nameTextId;

    /**
     * @type {number}
     * @private
     */
    _prefixTitleId = -1;

    /**
     * @type {number}
     * @private
     */
    _suffixTitleId = -1;

    /**
     * @type {string}
     * @private
     */
    _staticAreaName;

    /** @param {Client} client */
    constructor(client) {
        this.#client = client
    }

    /**
     * @param {{OID: number,DUM: boolean,N: string,E: number[],L: number,LL: number, RNP:number,H: number,AVP: number,CF: number,HF: number,PRE: number,SUF: number,TOPX: number,MP: number,R: number,AID: number,AR:number,AN:string,ACF:number,RPT: number,AP: number[][],VP: number[][],SA: number,VF: number,PF: number,RRD: number,TI: number,FN: {FID: number, MC: number, SPC:number, PMS:number, PMT:number, NS:number}}} params
     * @returns {this}
     */
    fillFromParamObject(params) {
        this.playerId = params.OID;
        this._isDummy = params.DUM;
        if (this._isDummy) {
            this.dummyFill();
        } else {
            this.playerName = params.N;
            this.crest = new Crest(this.#client, params.E);
            this.playerLevel = params.L;
            this.paragonLevel = params.LL;
            if (params.RNP > 0) this.noobEndTime = new Date(Date.now() + params.RNP * 1000);
            this._honor = params.H;
            this._famePoints = params.CF;
            this.highestFamePoints = params.HF;
            this.fameTopX = params.TOPX;
            this._isRuin = params.R === 1;
            this._allianceId = params.AID;
            this._allianceRank = params.AID === -1 ? -1 : params.AR;
            this._allianceName = params.AID === -1 ? "" : params.AN;
            this._allianceFame = params.AID === -1 ? -1 : params.ACF;
            this._isSearchingAlliance = params.SA === 1;
            if (params.RPT > 0) this.peaceEndTime = new Date(Date.now() + params.RPT * 1000);
            const castlePosItems = [];
            if(params.AP) this.ungroupArrayFromServer(params.AP, castlePosItems);
            this._castlePosList = this.parsePosList(castlePosItems);
            if (params.VP) {
                this._villagePosList = this.parsePosList(params.VP);
            }
            this._hasPremiumFlag = params.PF === 1;
            this._hasVIPFlag = params.VF === 1;
            this._might = !isNaN(params.MP) ? params.MP : -1;
            this._achievementPoints = params.AVP;
            this._prefixTitleId = params.PRE;
            this._suffixTitleId = params.SUF;
            if (params.RRD > 0) this.relocateDurationEndTime = new Date(Date.now() + params.RRD * 1000);

            if (params.FN && params.FN.FID !== -1) {
                this.fillFromFactionParamObject(params.FN);
            }
        }
        return this;
    }

    /**
     * @param {Array<Array>} sourceArray
     * @param {Array} returnArray
     * @private
     */
    ungroupArrayFromServer(sourceArray, returnArray) {
        for (const subArray of sourceArray) {
            if (subArray.length > 0 && Array.isArray(subArray[0])) {
                this.ungroupArrayFromServer(subArray, returnArray);
            } else {
                returnArray.push(subArray);
            }
        }
    }

    /**
     * @param {Array} posItems
     * @returns {CastlePosition[]}
     * @private
     */
    parsePosList(posItems) {
        /**@type {CastlePosition[]} */
        const castlePositions = [];
        for (const item of posItems) {
            const castlePosition = new CastlePosition();
            castlePosition.kingdomId = item[0];
            castlePosition.objectId = item[1];
            castlePosition.xPos = item[2];
            castlePosition.yPos = item[3];
            castlePosition.areaType = item[4];
            castlePositions.push(castlePosition);
        }
        return castlePositions;
    }

    /** @param {{FID: number, MC: number, SPC:number, PMS:number, PMT:number, NS:number}} paramObj */
    fillFromFactionParamObject(paramObj) {
        if (paramObj) {
            this.factionId = paramObj.FID;
            this._factionMainCampId = paramObj.MC;
            this.updateFactionProtectionFromParamObject(paramObj);
            this.factionIsSpectator = paramObj.SPC === 1;
        }
    }

    /** @param {{FID: number, MC: number, SPC:number, PMS:number, PMT:number, NS:number}} paramObj */
    updateFactionProtectionFromParamObject(paramObj) {
        this.factionProtectionStatus = paramObj.PMS;
        if (paramObj.PMT) this.factionProtectionEndTime = new Date(Date.now() + paramObj.PMT * 1000);
        if (paramObj.NS > 0) this.factionNoobProtectionEndTime = new Date(Date.now() + paramObj.NS * 1000);
        if (this.factionProtectionEndTime.getTime() > Date.now() && this.factionProtectionStatus !== -1) {
            if (!this.gameTickSignal) {
                //this.gameTickSignal = AppCore.getInstance().getSignal(GameTickOnlySecondsSignal)/* as GameTickOnlySecondsSignal*/;
                //this.gameTickSignal.add(this.onGameTick);
            }
        } else {
            this.removeTimerListener();
        }
    }

    /** @private */
    removeTimerListener() {
        if (this.gameTickSignal) {
            //this.gameTickSignal.remove(this.onGameTick);
            this.gameTickSignal = null;
        }
    }

    /**
     * @param {GameTickVO} gameTickVO
     * @private
     */
    onGameTick(gameTickVO) {
        if (this.factionProtectionEndTime.getTime() <= Date.now()) {
            this.removeTimerListener();
            //AppCore.getInstance().sendNotification(UpdateFactionProtectionSignal);
        }
    }

    dummyFill() {
        this._isDummy = true;
    }

    /** @returns {boolean} */
    get isFactionNoobProtected() {
        return this.factionNoobProtectionEndTime.getTime() > Date.now();
    }

    /** @returns {boolean} */
    isFactionProtected() {
        return this.factionProtectionEndTime.getTime() > Date.now() && this.factionProtectionStatus === 1;
    }

    /** @returns {Coordinate} */
    getFactionMainCampPosition() {
        if (this.factionMainCampId < 0) {
            return null;
        }
        let i = 0;
        while (i < this.castlePosList.length) {
            const castlePosition = this.castlePosList[i];
            if (castlePosition.kingdomId === 10 && castlePosition.objectId === this.factionMainCampId) {
                return castlePosition.position;
            }
            i++;
        }
        return null;
    }

    /** @returns {number} */
    get might() {
        return this._might;
    }

    /** @returns {boolean} */
    isNoobProtected() {
        return this.noobEndTime.getTime() > Date.now() || this.#client.clientUserData.noobProtected && this.isOwnOwnerInfo;
    }

    /** @returns {boolean} */
    isPeaceProtected() {
        return this.peaceEndTime.getTime() > Date.now() || this.#client.clientUserData.peaceModeStatus === 1 && this.isOwnOwnerInfo;
    }

    /** @returns {number} */
    get allianceId() {
        return this._allianceId;
    }

    /** @returns {number} */
    get allianceRank() {
        return this._allianceRank;
    }

    /** @returns {boolean} */
    get isRuin() {
        return this._isRuin;
    }

    /** @returns {number} */
    get honor() {
        return this._honor;
    }

    /** @returns {number} */
    get playerTotalLevel() {
        return this.playerLevel + this.paragonLevel;
    }

    /** @returns {boolean} */
    get isParagon() {
        return this.paragonLevel > 0;
    }

    /**
     * @param {number} kingdomId
     * @param {boolean} isShadowMovement
     * @returns {Crest}
     */
    getCrestByKingdomId(kingdomId, isShadowMovement = false) {
        if (kingdomId === 10 && this.factionId !== -1 && !isShadowMovement) {
            return FactionConstClient.getCrestByFactionId(this.factionId);
        }
        return this.crest;
    }

    /** @returns {string} */
    get playerName() {
        let playerName = this._playerName;
        if ((!playerName || playerName === "") && this._namesFactory) {
            playerName = this._namesFactory.getNameByTextId(this._nameTextId);
        }
        return playerName;
    }

    /** @param {string} value */
    set playerName(value) {
        this._playerName = value;
    }

    /** @returns {boolean} */
    get isInAlliance() {
        return this._allianceId >= 0;
    }

    /** @returns {string} */
    get allianceName() {
        return !this._allianceName ? "" : this._allianceName
    }

    /** @returns {CastlePosition[]} */
    get castlePosList() {
        return this._castlePosList;
    }

    /**
     * @param {number} kingdomId
     * @returns {Coordinate} */
    getMainCastlePositionFromPosListByKingdomId(kingdomId) {
        let i = 0;
        while (i < this.castlePosList.length) {
            const castlePosition = this.castlePosList[i];
            if (this.isMainCastlePosInKingdom(castlePosition, kingdomId)) {
                return new Coordinate(this.#client, [castlePosition.xPos, castlePosition.yPos]);
            }
            i++;
        }
        return null;
    }

    /**
     * @param {Coordinate} pos
     * @returns {CastlePosition}
     */
    getCastlePosListItemByPos(pos) {
        let castlePosListItem
        let i = 0;
        while (i < this.castlePosList.length) {
            castlePosListItem = this.castlePosList[i];
            if (castlePosListItem.xPos === pos.X && castlePosListItem.yPos === pos.Y) {
                return castlePosListItem;
            }
            i++;
        }
        return castlePosListItem;
    }

    /** @returns {Coordinate} */
    getMainCastlePositionFromPosListForCurrentKingdom() {
        return this.getMainCastlePositionFromPosListByKingdomId(this.kingdomData.activeKingdomId);
    }

    /**
     * @param {number} kID
     * @returns {CastlePosition[]}
     */
    getCastlePosListByKingdomId(kID) {
        /** @type {CastlePosition[]} */
        const castlePositions = [];
        let i = 0;
        while (i < this._castlePosList.length) {
            const castlePosition = this._castlePosList[i];
            const kingdomId = castlePosition.kingdomId;
            const areaType = castlePosition.areaType;
            if (kingdomId === kID) {
                if (areaType === 1) {
                    castlePositions.unshift(castlePosition);
                } else {
                    castlePositions.push(castlePosition);
                }
            }
            i++;
        }
        if (this._villagePosList) {
            let i = 0;
            while (i < this._villagePosList.length) {
                const villagePosition = this._villagePosList[i];
                if (villagePosition.kingdomId === kID) {
                    castlePositions.push(villagePosition);
                }
                i++;
            }
        }
        return castlePositions;
    }

    /** @returns {boolean} */
    get isOwnOwnerInfo() {
        return this.#client.clientUserData.playerId === this.playerId;
    }

    /** @returns {number} */
    get famePoints() {
        return this._famePoints;
    }

    /** @returns {boolean} */
    get isSearchingAlliance() {
        return this._isSearchingAlliance;
    }

    /** @returns {boolean} */
    get hasPremiumFlag() {
        return this._hasPremiumFlag;
    }

    /** @returns {boolean} */
    get hasVIPFlag() {
        return this._hasVIPFlag;
    }

    /** @returns {boolean} */
    isRankInfoVisible() {
        if (this.#client.clientUserData.isInAlliance && !this.isOwnOwnerInfo && this.allianceId === this.#client.clientUserData.allianceId) {
            return /*(*/AppCore.getInstance().getModel(AllianceRankService)/* as AllianceRankService)*/.mayRerank(this.allianceRank);
        }
        return false;
    }

    /** @returns {number} */
    get achievementPoints() {
        return this._achievementPoints;
    }

    /** @returns {number} */
    get factionMainCampId() {
        return this._factionMainCampId;
    }

    /**
     * @param {CastlePosition} castlePos
     * @param {number} kingdomId
     * @returns {boolean}
     */
    isMainCastlePosInKingdom(castlePos, kingdomId) {
        if (castlePos.kingdomId !== kingdomId) {
            return false;
        }
        if (kingdomId === 10) {
            return castlePos.objectId === this.factionMainCampId;
        }
        return castlePos.areaType === 1 || castlePos.areaType === 12;
    }

    /** @returns {IsleTitleViewVO} */
    get titleVO() {
        return this._titleVO;
    }

    /** @param {IsleTitleViewVO} value */
    set titleVO(value) {
        this._titleVO = value;
    }

    /** @returns {number} */
    get prefixTitleId() {
        return this._prefixTitleId;
    }

    /** @returns {number} */
    get suffixTitleId() {
        return this._suffixTitleId;
    }

    /** @returns {string} */
    get staticAreaName() {
        return this._staticAreaName;
    }

    /** @param {string} value */
    set staticAreaName(value) {
        this._staticAreaName = value;
    }

    /**
     * @param {KingdomSkinNamesFactory} value
     * @param {string} nameTextId
     */
    setNamesFactory(value, nameTextId) {
        this._namesFactory = value;
        this._nameTextId = nameTextId;
    }

    /** @param {CastlePosition[]} value */
    set castlePosList(value) {
        this._castlePosList = value;
    }
}

module.exports = WorldmapOwnerInfo