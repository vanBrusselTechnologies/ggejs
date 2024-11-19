const ActiveEvent = require("./ActiveEvent");

class RatingEvent extends ActiveEvent {
    /** @type {number} */
    showingChance;

    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);

        this.showingChance = data["CH"];
    }

    get mainDialogName() {
        return "RatingsDialog";
    }
}

module.exports = RatingEvent;