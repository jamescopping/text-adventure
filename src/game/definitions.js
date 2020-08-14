import { JSONUtil } from "./util/jsonUtil";

export const OperandType = {
    COMMAND: "command",
    OJECT: "object",
    CHARACTER: "character",
    ITEM: "item",
    SPELL: "spell",
}

export const SpellType = {
    DAMAGE: "damage",
    HEAL: "heal",
    BUFF: "buff",
    DEBUFF: "debuff"
}


export const DamageType = {
    ACID: "acid",
    BLUDGEONING: "bludgeoning",
    COLD: "cold",
    FIRE: "fire",
    FORCE: "froce",
    LIGHTNING: "lightning",
    NECROTIC: "necrotic",
    PIERCING: "piercing",
    POISON: "poison",
    PSYCHIC: "psychic",
    RADIANT: "radiant",
    SLASHING: "slashing"
}

export const SpellMap = new Map(JSONUtil.jsonObjArrayToMap(require("./jsonList/spells.json"), "name"));
export const DebuffMap = new Map(JSONUtil.jsonObjArrayToMap(require("./jsonList/debuffs.json"), "name"));
export const BuffMap = new Map(JSONUtil.jsonObjArrayToMap(require("./jsonList/buffs.json"), "name"));
export const ItemMap = new Map(JSONUtil.jsonObjArrayToMap(require("./jsonList/items.json"), "name"));