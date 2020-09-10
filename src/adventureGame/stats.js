import { Resource } from "./resource";

export class Stats {
	constructor(resourceObjectArray, initiativeBonus = 0) {
		this.resourceList = [];
		resourceObjectArray.forEach((resourceObject) => {
			this.resourceList.push(new Resource(resourceObject));
		});

		this.setInitiativeBonus(initiativeBonus);
	}

	getResourceOfType(resourceType) {
		return this.resourceList.find((resource) => {
			return resource.getType() === resourceType;
		});
	}

	getInitiativeBonus() { return this.initiativeBonus }
	setInitiativeBonus(value) { this.initiativeBonus = (value !== undefined) ? parseInt(value) : 0 }
}
