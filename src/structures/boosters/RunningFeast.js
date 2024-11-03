class RunningFeast {
    festivalType = 0

    constructor() {
        this.endDate = new Date()
    }

    /** @param {{T: number, RT: number}} params */
    setData(params) {
        if (!params) return;
        this.festivalType = params.T;
        this.endDate = new Date(Date.now() + params.RT * 1000);
    }

    get isActive() {
        return this.endDate.getTime() > Date.now();
    }

    get remainingTimeInSeconds() {
        return Math.max(0, this.endDate.getTime() - Date.now());
    }
}

module.exports = RunningFeast