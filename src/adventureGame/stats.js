import { Resource } from "./resource";
import { MobStatus } from "./definitions";

export class Stats {
	constructor(resourceObjectArray) {
		this.resourceList = [];
		resourceObjectArray.forEach((resourceObject) => {
			this.resourceList.push(new Resource(resourceObject));
		});
		this.setStatus(MobStatus.ALIVE);
		this.setInitiativeBonus(0);
		this.setArmourClass(0);
	}

	getResourceOfType(resourceType) {
		return this.resourceList.find((resource) => {
			return resource.getType() === resourceType;
		});
	}

	getInitiativeBonus() { return this.initiativeBonus }
	setInitiativeBonus(value) { this.initiativeBonus = (value !== undefined) ? parseInt(value) : 0 }
	getArmourClass() { return this.armourClass }
	setArmourClass(value) { this.armourClass = (value !== undefined) ? parseInt(value) : 0 }
	getStatus() { return this.status }
	setStatus(status) { this.status = status }
}
