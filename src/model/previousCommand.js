import { Command } from "../adventureGame/command";

export const prevCommand = {
	maxSavedCommands: 10,
	list: [],
	index: -1,

	isListEmpty: function () { return this.size() === 0; },
	size: function () { return this.list.length; },
	prev: function () {
		if (this.index > 0) {
			this.index--;
		}
		return this.getCurrentCommand();
	},
	next: function () {
		if (this.index < this.list.length - 1) {
			this.index++;
		}
		return this.getCurrentCommand();
	},
	addCommand: function (command) {
		command = command.toString().toLowerCase();
		if (!this.compareLastCommand(command)) {
			this.list.push(command);
			if (this.list.length > this.maxSavedCommands) {
				this.list.shift();
			}
		}
		this.index = this.list.length;
	},
	compareLastCommand: function (command) { return command === this.list[this.size() - 1]; },
	getCurrentCommand: function () {
		if (this.isListEmpty()) return "";
		if (this.index >= 0 && this.index < this.list.length) {
			return new Command(this.list[this.index]);
		} else {
			return "";
		}
	}
};