import { operand } from "./operand";
import { ListUtil } from "../adventureGame/util/listUtil";

export const suggestion = {
	list: [],
	index: -1,
	error: "",

	populateList: function (list, compareString) {
		this.setList(ListUtil.filterListStartsWith(list, compareString));
	},

	generateError() {
		if (this.isListEmpty()) {
			this.setError(`[Error] No such ${operand.getType()}`);
			return true;
		} else {
			this.setError("");
			return false;
		}
	},

	isListEmpty: function () { return this.list.length === 0; },
	isError: function () { return this.error !== ""; },

	setError: function (newError) { this.error = newError; },
	setList: function (newList) { this.list = [...newList]; },
	getError: function () { return this.error; },
	getList: function () { return this.list; },
};