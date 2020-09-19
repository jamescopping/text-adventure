import { Resource } from "./resource";

export const MobStatus = {
	ALIVE: "alive",
	DEAD: "dead"
}
export class Stats {
	constructor(resourceObjectArray) {
		this.resourceList = [];
		resourceObjectArray.forEach((resourceObject) => {
			this.resourceList.push(new Resource(resourceObject));
		});
		this.buffSet = new Set();
		this.debuffSet = new Set();
		this.setStatus(MobStatus.ALIVE);
		this.setInitiativeBonus(0);
		this.setArmourClass(0);
		this.setAttackBonus(0);
	}

	getResourceOfType(resourceType) {
		return this.resourceList.find((resource) => {
			return resource.getType() === resourceType;
		});
	}

	getBuffSet() { return this.buffSet }
	getDebuffSet() { return this.debuffSet }
	addBuff(buff) { this.buffSet.add(buff) }
	removeBuff(buff) { this.buffSet.delete(buff) }
	addDebuff(debuff) { this.debuffSet.add(debuff) }
	removeDebuff(debuff) { this.debuffSet.delete(debuff) }

	getInitiativeBonus() { return this.initiativeBonus }
	setInitiativeBonus(value) { this.initiativeBonus = (value !== undefined) ? parseInt(value) : 0 }
	getArmourClass() { return this.armourClass }
	setArmourClass(value) { this.armourClass = (value !== undefined) ? parseInt(value) : 0 }
	getAttackBonus() { return this.attackBonus }
	setAttackBonus(value) { this.attackBonus = (value !== undefined) ? parseInt(value) : 0 }
	getStatus() { return this.status }
	setStatus(status) { this.status = status }
	getResourceList() { return this.resourceList }
}
