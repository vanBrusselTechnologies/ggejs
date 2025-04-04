const {constructionItems} = require('e4k-data').data;

class CastleConstructionItemBuilding {
    /**
     * @param {Client} client
     * @param {{CID:number, S:number, RS?:number}} data
     */
    constructor(client, data) {
        this.constructionItem = getConstructionItem(data.CID);
        this.constructionItemId = data.CID;
        this.slotIndex = data.S;
        this.slotTypeId = this.constructionItem.slotTypeID;
        if (data.RS) this.remainingTime = new Date(Date.now() + data.RS * 1000);
    }
}

/** @param {number} id */
function getConstructionItem(id) {
    return constructionItems.find(ci => ci.constructionItemID === id);
}

module.exports = CastleConstructionItemBuilding;