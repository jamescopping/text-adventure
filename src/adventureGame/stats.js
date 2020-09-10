import { Resource } from "./resource";
import { MobStatus } from "./definitions";

export class Stats {
	constructor(resourceObjectArray, initiativeBonus = 0, status = MobStatus.ALIVE) {
		this.resourceList = [];
		resourceObjectArray.forEach((resourceObject) => {
			this.resourceList.push(new Resource(resourceObject));
		});
		this.setStatus(status);
		this.setInitiativeBonus(initiativeBonus);
	}

	getResourceOfType(resourceType) {
		return this.resourceList.find((resource) => {
			return resource.getType() === resourceType;
		});
	}

	getInitiativeBonus() { return this.initiativeBonus }
	setInitiativeBonus(value) { this.initiativeBonus = (value !== undefined) ? parseInt(value) : 0 }
	getStatus() { return this.status }
	setStatus(status) { this.status = status }
}
