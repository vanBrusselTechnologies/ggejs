const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const Good = require("../Good");

const RESOURCE_KEY_INDEX = 0;
const KINGDOM_ID_INDEX = 1;
const AREA_ID_INDEX = 2;
const BREWERY_WOD_ID_INDEX = 3;
const BREWERY_OBJECT_ID_INDEX = 4;
const AREA_NAME_INDEX = 5;
const AREA_TYPE_INDEX = 6;

class BreweryMissingResourcesMessage extends BasicMessage {
    parseMetaData(client, metaArray) {
        this.resourceName = new Good(client, [metaArray[RESOURCE_KEY_INDEX], 0]).item;
        this.areaId = parseInt(metaArray[AREA_ID_INDEX]);
        this.kingdomId = parseInt(metaArray[KINGDOM_ID_INDEX]);
        this.areaName = metaArray[AREA_NAME_INDEX];
        this.areaType = parseInt(metaArray[AREA_TYPE_INDEX]);
        this.breweryObjectId = parseInt(metaArray[BREWERY_OBJECT_ID_INDEX]);
        this.breweryWodId = parseInt(metaArray[BREWERY_WOD_ID_INDEX]);
        this.senderName = this.areaName;
        this.subject = Localize.text(client, "message_header_relicBrewery_insufficientResources");
    }
}

module.exports = BreweryMissingResourcesMessage;