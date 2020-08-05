
export class Dice {

    static rollNDice(numberOfDice, diceType) {
        let total = 0;
        let dice = [];
        for (let index = 0; index < numberOfDice; index++) {
            dice.push(this.rollDice(diceType));
            total += dice[dice.length - 1];
        }
        return { total, dice };
    }

    static rollDice(diceType) { return Math.floor(Math.random() * diceType) + 1; }

    static async rollFromString(string) {
        const regex = new RegExp("(\d+d{1}\d+){1}");
        if (regex.test(string)) return;
        let rollString = string.match(/(\d+d{1}\d+){1}/g);
        if (rollString === null || rollString === undefined) return { total: "error string ont valid", dice: [] };
        let rollArray = rollString[0].split("d");
        return this.rollNDice(parseInt(rollArray[0]), parseInt(rollArray[1]));
    }
}

export const DiceType = {
    D4: 4,
    D6: 6,
    D8: 8,
    D10: 10,
    D12: 12,
    D20: 20,
    D100: 100
}