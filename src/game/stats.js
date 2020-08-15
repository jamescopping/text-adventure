import { Resource } from "./resource";

export class Stats {
  constructor(resourceObjectArray) {
    this.resourceList = [];
    resourceObjectArray.forEach((resourceObject) => {
      this.resourceList.push(new Resource(resourceObject));
    });
  }

  getResourceOfType(resourceType) {
    return this.resourceList.find((resource) => {
      return resource.getType() === resourceType;
    });
  }
}
