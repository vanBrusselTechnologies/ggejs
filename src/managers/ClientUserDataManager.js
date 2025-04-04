const Constants = require('../utils/Constants')

class ClientUserDataManager {
    /** @private */
    _mightData = {
        might: 0, highestAchievedMight: 0
    }
    /** @private */
    _playerInfo = {
        playerId: -1,
        userId: -1,
        userName: "",
        email: "",
        pendingEmailChange: "",
        registrationEmailVerified: false,
        userLevel: -1,
        isAccountSaved: false,
        hasEverChangedName: false,
        wasResetted: false,
        isPayUser: false,
        paymentDoublerCount: 0,
        isCheater: false,
        usernameMinimumLength: 1,
        registrationTimestamp: 0,
        hasConfirmedTOC: false,
        hasNewsletterSubscription: false,
        canGetNewsletterReward: false,
    }
    /** @private */
    _userData = {
        /** @type {Crest} */
        playerCrest: null,
        userXp: 0,
        userLevel: 0,
        userParagonLevel: 0,
        userXpCurrentLevel: 0,
        userXPtoNextLevel: 0,
        userActivityPoints: 0,
        userHonor: 0,
        userRanking: 0,
        minUserNameLength: 0,
        xpBuildingBoost: 0,
        allianceId: -1,
        allianceRank: 0,
        allianceCurrentFame: 0,
        isSearchingAlliance: false,
        noobProtected: false,
        noobProtectionEndTime: new Date(),
        peaceProtectionStatusEndTime: new Date(),
        peaceModeStatus: 0,
        noobProtectedPerKingdom: {},
        kingdomIdToRename: -1,
        castleList: {
            ownerId: -1,
            /**@type {MonumentMapobject[]}*/monuments: [],
            /**@type {{[kId: number]:(CastleMapobject | CapitalMapobject)[]}}*/castles: {},
            /**@type {KingstowerMapobject[]}*/kingstowers: [],
            /**@type {{ village: VillageMapobject, units: InventoryItem<Unit>[] }[]}*/publicVillages: [],
            /**@type {{ privateVillageId: number, uniqueId: number }[]}*/privateVillages: [],
        },
        joinCastleCount: 0,
        mayChangeCrest: true,
        shadowUnitInventory: {},
        totalShadowUnits: 0,
        travellingShadowUnits: 0,
        hasPremiumFlag: false,
        hasBeenCheckedNewMail: false,
        checkedMailsUnread: {},
        hasBeenCheckedDailyActivity: false,
        numberMailsUnread: -1,
        dailyNoteActive: false,
        taxNoteActive: false,
        mailNoteActive: false,
        allianceNoteActive: false,
        allianceNoteShown: false,
        rankingNoteActive: false,
        newBlogPostNoteActive: false,
        isFirstExecution: true,
        lastUserActivity: 0,
        relocationCount: 0,
        relocationDurationEndTime: new Date(),
        relocationCooldownEndTime: new Date(),
        /**@type {Coordinate}*/
        relocationDestination: null,
        /**@type {Coordinate}*/
        oldMainCastlePosition: null,
        displayXP: 0,
        titleVO: {},
        lifeTimeSpent: 0,
        facebookId: "",
        isXPDataInitialized: false,
        selectedHeroId: 0,
        hasFreeCastleRename: false,
        /** @type {number[]} */
        activeMovementFilters: [],
    }
    /** @private */
    _goodsData = {
        selectedCastleId: 0, /** @type {Good[]} */
        globalCurrencies: [], /** @type {{[key:number]: Good[]}} */
        castleResourcesDict: {}
    }
    /** @private */
    _spyData = {
        maxSpies: 0, availablePlagueMonks: 0,
    }
    /** @private */
    _titlesData = {
        titlePoints: {},
        highestPoints: {},
        currentTitle: {},
        titlesRatingStatus: {},
        prefix: Constants.TitleType.UNKNOWN,
        suffix: Constants.TitleType.UNKNOWN,
        highestTitlesByTypeVO: {}
    }
    /** @private */
    _vipData = {
        showVIPFlagOption: false,
        _currentVIPPoints: 0,
        _maxVIPLevelReached: 0,
        _usedPremiumGenerals: 0,
        _vipTimeExpireTimestamp: 0
    }
    /** @private */
    _allianceData = {
        _myAlliance: null
    }
    /** @type {PremiumBoostData} */
    boostData;
    /** @type {QuestData} */
    questData;

    /** @returns {boolean} */
    get isXPDataInitialized() {
        return this._userData.isXPDataInitialized;
    }

    /** @param {boolean} val */
    set isXPDataInitialized(val) {
        this._userData.isXPDataInitialized = val;
    }

    /** @returns {number} */
    get userXp() {
        return this._userData.userXp;
    }

    /** @param {number} val */
    set userXp(val) {
        this._userData.userXp = val;
    }

    /** @returns {number} */
    get level() {
        return this._userData.userLevel;
    }

    /** @param {number} val */
    set userLevel(val) {
        this._userData.userLevel = val;
        this._playerInfo.userLevel = val;
    }

    /** @returns {number} */
    get legendaryLevel() {
        return this._userData.userParagonLevel;
    }

    /** @param {number} val */
    set userParagonLevel(val) {
        this._userData.userParagonLevel = val;
    }

    /** @returns {number} */
    get userXpCurrentLevel() {
        return this._userData.userXpCurrentLevel;
    }

    /** @param {number} val */
    set userXpCurrentLevel(val) {
        this._userData.userXpCurrentLevel = val;
    }

    /** @returns {number} */
    get userXPtoNextLevel() {
        return this._userData.userXPtoNextLevel;
    }

    /** @param {number} val */
    set userXPtoNextLevel(val) {
        this._userData.userXPtoNextLevel = val;
    }

    /** @returns {number} */
    get displayXP() {
        return this._userData.displayXP;
    }

    /** @param {number} val */
    set displayXP(val) {
        this._userData.displayXP = val;
    }

    /** @returns {boolean} */
    get hasPremiumFlag() {
        return this._userData.hasPremiumFlag;
    }

    /** @param {boolean} val */
    set hasPremiumFlag(val) {
        this._userData.hasPremiumFlag = val;
    }

    /** @returns {number} */
    get honor() {
        return this._userData.userHonor;
    }

    /** @param {number} val */
    set userHonor(val) {
        this._userData.userHonor = val;
    }

    /** @returns {number} */
    get userRanking() {
        return this._userData.userRanking;
    }

    /** @param {number} val */
    set userRanking(val) {
        this._userData.userRanking = val;
    }

    /** @returns {number} */
    get mightpoints() {
        return this._mightData.might;
    }

    /** @param {number} val */
    set mightpoints(val) {
        this._mightData.might = val;
    }

    /** @returns {number} */
    get highestAchievedMight() {
        return this._mightData.highestAchievedMight;
    }

    /** @param {number} val */
    set highestAchievedMight(val) {
        this._mightData.highestAchievedMight = val;
    }

    /** @returns {number} */
    get paymentDoublerCount() {
        return this._playerInfo.paymentDoublerCount;
    }

    /** @param {number} val */
    set paymentDoublerCount(val) {
        this._playerInfo.paymentDoublerCount = val;
    }

    /** @returns {boolean} */
    get isPayUser() {
        return this._playerInfo.isPayUser;
    }

    /** @param {boolean} val */
    set isPayUser(val) {
        this._playerInfo.isPayUser = val;
    }

    /** @returns {number} */
    get userId() {
        return this._playerInfo.userId;
    }

    /** @param {number} val */
    set userId(val) {
        this._playerInfo.userId = val;
    }

    //todo: pingVO + pingDashed

    /** @returns {number} */
    get playerId() {
        return this._playerInfo.playerId;
    }

    /** @param {number} val */
    set playerId(val) {
        this._playerInfo.playerId = val;
    }

    /** @returns {string} */
    get userName() {
        return this._playerInfo.userName;
    }

    /** @param {string} val */
    set userName(val) {
        this._playerInfo.userName = val;
    }

    /** @returns {string} */
    get email() {
        return this._playerInfo.email;
    }

    /** @param {string} val */
    set email(val) {
        this._playerInfo.email = val;
    }

    /** @returns {string | null} */
    get pendingEmailChange() {
        return this._playerInfo.pendingEmailChange;
    }

    /** @param {string | null} val */
    set pendingEmailChange(val) {
        this._playerInfo.pendingEmailChange = val;
    }

    /** @returns {boolean} */
    get isCheater() {
        return this._playerInfo.isCheater;
    }

    /** @param {boolean} val */
    set isCheater(val) {
        this._playerInfo.isCheater = val;
    }

    /** @returns {boolean} */
    get hasEverChangedName() {
        return this._playerInfo.hasEverChangedName;
    }

    /** @param {boolean} val */
    set hasEverChangedName(val) {
        this._playerInfo.hasEverChangedName = val;
    }

    /** @returns {number} */
    get registrationDate() {
        return new Date(this._playerInfo.registrationTimestamp * 1000);
    }

    /** @param {number} val */
    set registrationTimestamp(val) {
        this._playerInfo.registrationTimestamp = val;
    }

    /** @returns {boolean} */
    get hasConfirmedTOC() {
        return this._playerInfo.hasConfirmedTOC;
    }

    /** @param {boolean} val */
    set hasConfirmedTOC(val) {
        this._playerInfo.hasConfirmedTOC = val;
    }

    /** @returns {boolean} */
    get isAccountSaved() {
        return this._playerInfo.isAccountSaved;
    }

    /** @param {boolean} val */
    set isAccountSaved(val) {
        this._playerInfo.isAccountSaved = val;
    }

    /** @returns {boolean} */
    get hasFreeCastleRename() {
        return this._userData.hasFreeCastleRename;
    }

    /** @param {boolean} val */
    set hasFreeCastleRename(val) {
        this._userData.hasFreeCastleRename = val;
    }

    /** @returns {number} */
    get lifeTimeSpent() {
        return this._userData.lifeTimeSpent;
    }

    /** @param {number} val */
    set lifeTimeSpent(val) {
        this._userData.lifeTimeSpent = val;
    }

    /** @returns {string | null} */
    get facebookId() {
        return this._userData.facebookId;
    }

    /** @param {string | null} val */
    set facebookId(val) {
        this._userData.facebookId = val;
    }

    /** @returns {number} */
    get minUserNameLength() {
        return this._userData.minUserNameLength;
    }

    /** @param {number} val */
    set minUserNameLength(val) {
        this._userData.minUserNameLength = val;
    }

    /** @returns {number} */
    get allianceId() {
        return this._userData.allianceId;
    }

    /** @param {number} val */
    set allianceId(val) {
        this._userData.allianceId = val;
    }

    /** @returns {number} */
    get allianceRank() {
        return this._userData.allianceRank;
    }

    /** @param {number} val */
    set allianceRank(val) {
        this._userData.allianceRank = val;
    }

    /** @returns {number} */
    get allianceCurrentFame() {
        return this._userData.allianceCurrentFame;
    }

    /** @param {number} val */
    set allianceCurrentFame(val) {
        this._userData.allianceRank = val;
    }

    /** @returns {boolean} */
    get isSearchingAlliance() {
        return this._userData.isSearchingAlliance;
    }

    /** @param {boolean} val */
    set isSearchingAlliance(val) {
        this._userData.isSearchingAlliance = val;
    }

    /** @returns {boolean} */
    get wasResetted() {
        return this._playerInfo.wasResetted;
    }

    /** @param {boolean} val */
    set wasResetted(val) {
        this._playerInfo.wasResetted = val;
    }

    /** @returns {Date} */
    get lastUserActivity() {
        return new Date(Date.now - this._userData.lastUserActivity * 1000);
    }

    /** @param {number} val */
    set lastUserActivity(val) {
        this._userData.lastUserActivity = val;
    }

    /** @returns {number} */
    get selectedHeroId() {
        return this._userData.selectedHeroId;
    }

    /** @param {number} val */
    set selectedHeroId(val) {
        this._userData.selectedHeroId = val;
    }

    /** @returns {number} */
    get maxSpies() {
        return this._spyData.maxSpies;
    }

    /** @param {number} val */
    set maxSpies(val) {
        this._spyData.maxSpies = val;
    }

    /** @returns {number} */
    get availablePlagueMonks() {
        return this._spyData.availablePlagueMonks;
    }

    /** @param {number} val */
    set availablePlagueMonks(val) {
        this._spyData.availablePlagueMonks = val;
    }

    /** @returns {Date} */
    get noobProtectionEndTime() {
        return this._userData.noobProtectionEndTime;
    }

    /** @param {Date} val */
    set noobProtectionEndTime(val) {
        this._userData.noobProtectionEndTime = val;
    }

    /** @returns {boolean} */
    get noobProtected() {
        return this._userData.noobProtected;
    }

    /** @param {boolean} val */
    set noobProtected(val) {
        this._userData.noobProtected = val;
    }

    /** @returns {Date} */
    get peaceProtectionStatusEndTime() {
        return this._userData.peaceProtectionStatusEndTime;
    }

    /** @param {Date} val */
    set peaceProtectionStatusEndTime(val) {
        this._userData.peaceProtectionStatusEndTime = val;
    }

    /** @returns {number} */
    get peaceModeStatus() {
        return this._userData.peaceModeStatus;
    }

    /** @param {number} val */
    set peaceModeStatus(val) {
        this._userData.peaceModeStatus = val;
    }

    /** @returns {number[]} */
    get activeMovementFilters() {
        return this._userData.activeMovementFilters;
    }

    /** @param {number[]} val */
    set activeMovementFilters(val) {
        this._userData.activeMovementFilters = val;
    }

    /** @returns {number} */
    get relocationCount() {
        return this._userData.relocationCount;
    }

    /** @param {number} val */
    set relocationCount(val) {
        this._userData.relocationCount = val;
    }

    /** @returns {Date} */
    get relocationDurationEndTime() {
        return this._userData.relocationDurationEndTime;
    }

    /** @param {Date} val */
    set relocationDurationEndTime(val) {
        this._userData.relocationDurationEndTime = val;
    }

    /** @returns {Date} */
    get relocationCooldownEndTime() {
        return this._userData.relocationCooldownEndTime;
    }

    /** @param {Date} val */
    set relocationCooldownEndTime(val) {
        this._userData.relocationCooldownEndTime = val;
    }

    /** @returns {Coordinate} */
    get relocationDestination() {
        return this._userData.relocationDestination;
    }

    /** @param {Coordinate} val */
    set relocationDestination(val) {
        this._userData.relocationDestination = val;
    }

    /** @returns {boolean} */
    get mayChangeCrest() {
        return this._userData.mayChangeCrest;
    }

    /** @param {boolean} val */
    set mayChangeCrest(val) {
        this._userData.mayChangeCrest = val;
    }

    /** @returns {Crest} */
    get playerCrest() {
        return this._userData.playerCrest;
    }

    /** @param {Crest} val */
    set playerCrest(val) {
        this._userData.playerCrest = val;
    }

    /** @returns {Good[]} */
    get globalCurrencies() {
        return this._goodsData.globalCurrencies;
    }

    /** @param {Good} val */
    setGlobalCurrency(val) {
        /** @type {Good} */
        const g = this._goodsData.globalCurrencies.find(g => g.item === val.item);
        if (g == null) this._goodsData.globalCurrencies.push(val); else g.count = val.count;
    }

    /** @param {number} val see Constants.TitleType for possibilities */
    set titlePrefix(val) {
        this._titlesData.prefix = val;
    }

    get titlePrefix() {
        return this.currentTitle(this._titlesData.prefix);
    }

    /** @param {number} val see Constants.TitleType for possibilities */
    set titleSuffix(val) {
        this._titlesData.suffix = val;
    }

    get titleSuffix() {
        return this.currentTitle(this._titlesData.suffix);
    }

    //


    //

    /** @returns {boolean} */
    isLegendLevel() {
        return this._userData.userParagonLevel > 0;
    }

    /**
     * @param {number} kingdomId
     * @param {number} remainingNoobTimeInSeconds
     * @private
     */
    setKingdomNoobProtection(kingdomId, remainingNoobTimeInSeconds) {
        this._userData.noobProtectedPerKingdom[kingdomId] = remainingNoobTimeInSeconds > 0;
    }

    /**
     * @param {number} points
     * @param {number} titleType see Constants.TitleType for possibilities
     */
    setTitlePoints(points, titleType) {
        this._titlesData.titlePoints[titleType] = points;
    }

    /**
     * @param {number} titleType see Constants.TitleType for possibilities
     * @returns {number}
     */
    titlePoints(titleType) {
        return this._titlesData.titlePoints[titleType];
    }

    setCurrentTitle(titleType, title) {
        this._titlesData.currentTitle[titleType] = title;
    }

    currentTitle(titleType) {
        return this._titlesData.currentTitle[titleType];
    }

    /**
     * @param {number} titleType see Constants.TitleType for possibilities
     */
    clearCurrentTitle(titleType) {
        delete this._titlesData.currentTitle[titleType];
    }

    /**
     * @param {number} points
     * @param {number} titleType see Constants.TitleType for possibilities
     */
    setHighestTitlePoints(points, titleType) {
        this._titlesData.highestPoints[titleType] = points;
    }

    /**
     * @param {number} titleType see Constants.TitleType for possibilities
     * @returns {number}
     */
    highestTitlePoints(titleType) {
        return this._titlesData.highestPoints[titleType];
    }


    /* todo: TitleRatingStatus
     * @param {TitleRatingStatus} titleRatingStatus
     * @param {number} titleType see Constants.TitleType for possibilities
     * /
    setTitleRatingStatus(titleRatingStatus, titleType){
         this._titlesData.titlesRatingStatus[titleType] = points
     }
     */

    /* todo: TitleRatingStatus
     * @param {number} titleType see Constants.TitleType for possibilities
     * @returns {TitleRatingStatus}
     * /
    titleRatingStatus(titleType){
         return this._titlesData.titlesRatingStatus[titleType]
     }
     */

    /** @return {boolean} */
    get showVIPFlagOption() {
        return this._vipData.showVIPFlagOption;
    }

    /** @param {Boolean} val */
    set showVIPFlagOption(val) {
        this._vipData.showVIPFlagOption = val;
    }

    /** @return {number} */
    get vipPoints() {
        return this._vipData._currentVIPPoints;
    }

    /** @param {number} points */
    set vipPoints(points) {
        this._vipData._currentVIPPoints = points < 0 ? 0 : points;
        //todo: this._vipData._currentVIPLevel = getVIPLevelInfoVOByPoints(points);
    }

    /** @return {number} */
    get maxVIPLevelReached() {
        return this._vipData._maxVIPLevelReached;
    }

    /** @param {number} level */
    set maxVIPLevelReached(level) {
        this._vipData._maxVIPLevelReached = level < 1 ? 1 : level;
    }

    /** @return {number} */
    get usedPremiumGenerals() {
        return this._vipData._usedPremiumGenerals;
    }

    /** @param {number} val */
    set usedPremiumGenerals(val) {
        this._vipData._usedPremiumGenerals = val;
    }

    /** @return {Date} */
    get vipTimeExpireDate() {
        return new Date(this._vipData._vipTimeExpireTimestamp);
    }

    /** @param {number} val */
    set vipTimeExpireTimestamp(val) {
        const active = val > 0;
        //todo: this._vipData._vipModeStatusVO.isActive = active;
        this._vipData._vipTimeExpireTimestamp = active ? Date.now() + val * 1000 : 0;
    }

    get isVIPModeActive() {
        return this.vipTimeExpireDate.getTime() > Date.now();
    }

    get showVIPFlagOnCastle() {
        return this.showVIPFlagOption && this.isVIPModeActive;
    }

    /** @return {MyAlliance} */
    get myAlliance() {
        return this._allianceData._myAlliance;
    }

    /** @param {MyAlliance} val */
    set myAlliance(val) {
        this._allianceData._myAlliance = val;
    }
}

module.exports = ClientUserDataManager;