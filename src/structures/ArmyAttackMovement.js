const CompactArmy = require("./CompactArmy");
const BasicMovement = require("./BasicMovement");
const Client = require('./../Client');

class ArmyAttackMovement extends BasicMovement {
   armyState = 0;
   /**
    * 
    * @param {Client} client 
    * @param {*} data 
    */
   constructor(client, data) {
      super(client, data);
      if (data.FA) {
         /** @type {CompactArmy} */
         this.army = parseArmy(client, data.FA);
         this.armyState = 0;
      }
      else if (data.GA) {
         this.army = parseArmy(client, data.GA);
         this.armyState = 1;
      }
      else if (data.GS) {
         /** @type {number} */
         this.guessedSize = data.GS;
         this.armyState = 2;
      }
      /** @type {number} */
      this.attackType = parseInt(data.ATT);
      /** @type {boolean} */
      this.isShadowMovement = data.SM === 1;
      /** @type {boolean} */
      this.isForceCancelable = !!data.FC ? data.FC === 1 : false;
   }
}

function parseArmy(client, data) {
   return new CompactArmy(client, data);
}

module.exports = ArmyAttackMovement;