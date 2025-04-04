class PrimeTime {
    /** @type {number} */
    type;
    /** @type {number} */
    premiumBonus;
    /** @type {number} */
    standardBonus;
    /** @type {Date} */
    endTime;
    /** @type {boolean} */
    isTimeless;
    /** @type {boolean} */
    isGlobal;

    /**
     * @param {Client} client
     * @param {{isTimeless:boolean,duration:number,bonusStandard:number,discount:number,typeId:number,type:number,bonusPremium:number,remainingTime:number}} data
     */
    constructor(client, data) {
        this.type = data.type;
        this.premiumBonus = data.bonusPremium;
        this.standardBonus = data.bonusStandard;
        this.endTime = new Date(Date.now() + data.remainingTime * 1000);
        this.isTimeless = data.isTimeless;
        this.isGlobal = this.type === 1;
    }

    /** @returns {boolean} */
    get isActive(){
        return this.endTime.getTime() > Date.now()
    }
}

module.exports = PrimeTime;