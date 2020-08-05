export const commandList = ['/roll', '/help', '/save', 'inventory', 'stats', 'goto', 'look', 'investigate', 'talkto', 'pickup', 'attack', 'loot', 'cast'].sort();

export const OperandTypeDictionary = {
    COMMAND: 'command',
    OJECT: 'object',
    CHARACTER: 'character',
    ITEM: 'item',
    SPELL: 'spell',
}

export const ItemList = [
    {
        name: 'key#1',
    },
    {
        name: 'key#2',
    },
    {
        name: 'key#3',
    },
    {
        name: 'key#4',
    },
    {
        name: 'magicbox',
    },
    {
        name: 'sword',
    },
    {
        name: 'chainmailshirt',
    },

];


export const SpellType = {
    DAMAGE: 'damage',
    HEAL: 'heal',
    BUFF: 'buff',
    DEBUFF: 'debuff'
}


export const DamageType = {
    ACID: 'acid',
    BLUDGEONING: 'bludgeoning',
    COLD: 'cold',
    FIRE: 'fire',
    FORCE: 'froce',
    LIGHTNING: 'lightning',
    NECROTIC: 'necrotic',
    PIERCING: 'piercing',
    POISON: 'poison',
    PSYCHIC: 'psychic',
    RADIANT: 'radiant',
    SLASHING: 'slashing'
}


import { DiceType } from "./dice";
export const SpellList = [
    {
        name: 'firebolt',
        spelltype: SpellType.DAMAGE,
        damageType: DamageType.FIRE,
        baseManaCost: 25,
        diceType: DiceType.D6,
        numberOfDice: 2,
        bonus: 4
    },
    {
        name: 'magicmissile',
        spelltype: SpellType.DAMAGE,
        damageType: DamageType.FORCE,
        baseManaCost: 5,
        diceType: DiceType.D4,
        numberOfDice: 1,
        bonus: 2
    },
];

export const DebuffList = [
    {
        name: 'blinded'
    },
    {

    },
    {

    },
    {

    },
    {
        name: 'stunned',
    },
];

export const BuffList = [];

