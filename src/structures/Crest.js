class Crest {
    /** @type {number[]} */
    colors = [];

    /** @type {number[]} */
    colorsTwo = [];

    /**
     *
     * @param {Client} client
     * @param {number[] | {SC1: number, SC2: number, SPT: number, BGC2: number, BGC1: number, BGT: number, S1: number, S2: number}} data
     */
    constructor(client, data) {
        if (!data) return
        if (data.BGT != null) {
            this.backgroundType = data.BGT;
            this.backgroundColor1 = data.BGC1;
            this.backgroundColor2 = this.backgroundType === 0 ? this.backgroundColor1 : data.BGC2;
            this.symbolPosType = data.SPT;
            this.symbolType1 = data.S1;
            this.symbolType2 = data.S2;
            this.symbolColor1 = data.SC1;
            this.symbolColor2 = data.SC2;
        } else {
            this.backgroundType = data[0];
            this.backgroundColor1 = data[1];
            this.backgroundColor2 = this.backgroundType === 0 ? this.backgroundColor1 : data[2];
            this.symbolPosType = data[4];
            this.symbolType1 = data[5];
            this.symbolType2 = data[7];
            this.symbolColor1 = data[6];
            this.symbolColor2 = data[8];
        }

        this.fillClipColor()
    }

    /** @returns {{SC1: number, SC2: number, SPT: number, BGC2: number, BGC1: number, BGT: number, S1: number, S2: number}}*/
    getParamObject() {
        return {
            "BGT": this.backgroundType,
            "BGC1": this.backgroundColor1,
            "BGC2": this.backgroundColor2,
            "SPT": this.symbolPosType,
            "S1": this.symbolType1,
            "SC1": this.symbolColor1,
            "S2": this.symbolType2,
            "SC2": this.symbolColor2
        };
    }

    fillClipColor() {
        this.colors = [];
        switch (this.backgroundType) {
            case 0:
                this.colors.push(this.backgroundColor1, this.backgroundColor1, this.backgroundColor1, this.backgroundColor1);
                break;
            case 1:
                this.colors.push(this.backgroundColor1, this.backgroundColor2, this.backgroundColor1, this.backgroundColor2);
                break;
            case 2:
                this.colors.push(this.backgroundColor1, this.backgroundColor1, this.backgroundColor2, this.backgroundColor2);
                break;
            case 3:
                this.colors.push(this.backgroundColor1, this.backgroundColor2, this.backgroundColor2, this.backgroundColor1);
        }
        this.colorsTwo = [];
        if (this.backgroundType === 0) {
            this.colorsTwo.push(this.backgroundColor1, this.backgroundColor1);
        } else {
            this.colorsTwo.push(this.backgroundColor1, this.backgroundColor2);
        }
    }
}

module.exports = Crest;