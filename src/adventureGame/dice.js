
export class Dice {

	static rollNDice(numberOfDice, diceType, bonus = 0) {
		let total = bonus;
		let dice = [];
		for (let index = 0; index < numberOfDice; index++) {
			dice.push(this.rollDice(diceType, bonus));
			total += dice[dice.length - 1];
		}
		return { total, dice };
	}

	static rollDice(diceType) { return Math.floor(Math.random() * diceType) + 1; }

	/**
	 * Rolls three eight sided dice and returns an object of the total and the in individual dice 
	 * @param {string} rollString 
	 */
	static rollFromString(rollString) {
		if (rollString.match(/^\d+d\d+(\+\d+)?$/)) {
			let rollArray = rollString.split("d", 2);
			let bonus = 0;
			if (rollArray[1].includes("+")) [rollArray[1], bonus] = rollArray[1].split("+", 2);
			return this.rollNDice(parseInt(rollArray[0]), parseInt(rollArray[1]), parseInt(bonus));
		}
		return { total: 0, dice: [] };
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