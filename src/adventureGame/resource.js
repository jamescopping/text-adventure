export class Resource {
	constructor(resourceObj) {
		const { resourceType, currentValue, maxValue } = resourceObj;
		this.type = resourceType;
		this.currentValue = parseInt(currentValue);
		this.maxValue = parseInt(maxValue);
	}

	add(addition) {
		this.currentValue += addition;
		if (this.currentValue > this.maxValue) this.currentValue = this.maxValue;
		return this.currentValue;
	}

	subtract(subtraction) {
		this.currentValue -= subtraction;
		if (this.currentValue < 0) this.currentValue = 0;
		return this.currentValue;
	}

	isEmpty() { return this.currentValue === 0 }
	getCurrentPercentage() { return (this.currentValue / this.maxValue) * 100 }
	getCurrentValue() { return this.currentValue }
	getMaxValue() { return this.maxValue }

	setCurrentValue(value) { this.currentValue = value }
	setMaxValue(value) { this.maxValue = value }

	getType() { return this.type; }
	toString() { return `resourceType: ${this.type}, currentValue: ${this.currentValue}, maxValue: ${this.maxValue}` }
}

export const ResourceType = {
	HEALTH: "health",
	STAMINA: "stamina",
	MANA: "mana"
};
