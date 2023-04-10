const {Coordinate} = require("./Coordinate");
const {MonumentMapobject} = require("./MonumentMapobject");
const CastleUserData = {
    playerCrest: null,//CrestVO
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
    /** @type {Date}*/
    noobProtectionEndTime: new Date(),
    /** @type {Date}*/
    peaceProtectionStatusEndTime: new Date(),
    peaceModeStatus: 0,
    noobProtectedPerKingdom: {},
    kingdomIdToRename: -1,
    castleListVO: {/**@type {MonumentMapobject[]}*/monuments: []},
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
    /** @type {Date}*/
    relocationDurationEndTime: new Date(),
    /** @type {Date}*/
    relocationCooldownEndTime: new Date(),
    /**@type {Coordinate}*/
    relocationDestination: null,
    /**@type {Coordinate}*/
    oldMainCastlePosition: null,
    displayXP: 0,
    titleVO: {},
    lifeTimeSpent: 0,
    facebookID: "",
    isXPDataInitialized: false,
    selectedHeroID: 0,
    hasFreeCastleRename: false,
    activeMovementFilters: [],
    isParagon() {
        return this.userParagonLevel > 0;
    },
    /**
     * @param {number} kingdomID
     * @param {number} remainingNoobTimeInSeconds
     */
    setKingdomNoobProtection(kingdomID, remainingNoobTimeInSeconds) {
        this.noobProtectedPerKingdom[kingdomID] = remainingNoobTimeInSeconds > 0;
    },
}

module.exports = CastleUserData;