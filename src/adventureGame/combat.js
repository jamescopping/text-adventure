import { MobStatus } from "./stats";
import { Game, GameMode } from "./game";
import { log, clearCombatOptionClass } from "../controller/adventureLogController";
import { Dice, DiceType } from "./dice";
import { Scene } from "./scene";
import { Story } from "./story";
import { ResourceType } from "./resource";

const playersTurnOptionsOutput = `Select Action | <span class="combat-option">Weapons</span> | <span class="combat-option">Items</span> | <span class="combat-option">Spells</span> | <span class="combat-option">Flee</span> |`;
const backCombatOption = `<span class="combat-option">back</span> |`;

const AttackType = {
    SINGLE: 'single',
    MULTI: 'multi',
    RANDOM: 'random'
}
const DamageType = {
    ACID: "acid",
    BLUDGEONING: "bludgeoning",
    COLD: "cold",
    FIRE: "fire",
    FORCE: "force",
    LIGHTNING: "lightning",
    NECROTIC: "necrotic",
    PIERCING: "piercing",
    POISON: "poison",
    PSYCHIC: "psychic",
    RADIANT: "radiant",
    SLASHING: "slashing"
}
const SpellType = {
    DAMAGE: "damage",
    HEAL: "heal",
    BUFF: "buff",
    DEBUFF: "debuff"
}

export class Combat {
    constructor() {
        this.reset();
    }

    reset() {
        this.enemies = [];
        this.roundOrder = [];
        this.numberOfActiveMobs = 0;
        this.roundNumber = 1;
        this.playerFled = false;
        this.playerRef = Game.getPlayer();
    }

    async start() {
        Game.changeGameMode(GameMode.COMBAT);
        this.reset();
        log("Combat started!");
        this.enemies = Game.getCurrentScene().getMobs().filter(mobObj => mobObj.stats.getStatus() === MobStatus.ALIVE && mobObj.type === "enemy");
        if (this.enemies.length === 0) return false;
        this.rollRoundOrder();
        await this.loop();
    }

    async loop() {
        this.numberOfActiveMobs = this.enemies.length;
        while (!this.playerFled && this.playerRef.isAlive() && this.anyActiveMobs()) {
            this.roundStart();
            await this.roundOfCombat();
            this.updateNumOfActiveMobs();
        }

        if (this.playerRef.isAlive() && !this.playerFled && !this.anyActiveMobs()) {
            log("You win... Combat is over!");
            this.end();
        } else if (this.playerRef.isAlive() && this.playerFled) {
            log(`You successfully escape from combat!`);
            Game.changeGameMode(GameMode.ADVENTURE);
            Game.changeScene(Scene.getLastSceneName());
        } else if (!this.playerRef.isAlive()) {
            log("You died... Game Over");
            Game.start();
        }
    }

    roundStart() {
        log(`!!Round ${this.roundNumber++} of Combat!!`);
        let outString = "Combat order: ";
        this.roundOrder.forEach((obj, index) => {
            const combatIndex = obj.combatIndex;
            if (combatIndex === -1) {
                outString += "PLAYER";
            } else if (this.enemies[combatIndex].stats.getStatus() === MobStatus.ALIVE) {
                outString += `${this.enemies[combatIndex].mobName}#${combatIndex}`;
            } else {
                outString += "DEAD";
            }
            if (index < this.enemies.length) outString += " => ";
        });
        log(outString);
    }

    async roundOfCombat() {
        for (const { combatIndex, initiative } of this.roundOrder) {
            if (!this.anyActiveMobs()) break;
            if (this.playerFled || !this.playerRef.isAlive()) break;
            if (combatIndex === -1) {
                await this.playerTurn();
            } else {
                if (this.enemies[combatIndex].stats.getStatus() === MobStatus.DEAD) continue;
                await this.enemyTurn(combatIndex);
            }
            this.updateNumOfActiveMobs();
        }
    }

    async enemyTurn(combatIndex) {
        const enemy = this.enemies[combatIndex];
        log(`${enemy.mobName}#${combatIndex}'s turn`);
        await this.sleep(1000 + Dice.rollNDice(10, DiceType.D100).total);

        //figure out what the enemy can do.. 
        //what level of AI do we want the enemies to have

        const weaponNameList = (enemy.inventory.getItemListOfType("weapon")).map(weaponObj => weaponObj.itemName);
        const randomIndex = Dice.rollDice(weaponNameList.length) - 1;
        let weaponSelection = Story.getItem(weaponNameList[randomIndex]);

        log(`${enemy.mobName}#${combatIndex} used ${weaponSelection.name}`);

        let damageRoll = Dice.rollFromString(weaponSelection.damageDice).total;
        const damageType = weaponSelection.damageType;
        let attackRoll = Dice.rollDice(DiceType.D20) + enemy.stats.getAttackBonus();
        if (attackRoll === 20) { damageRoll = Math.round(damageRoll * 2); log("CRIT!"); }
        if (attackRoll === 20 || attackRoll >= this.playerRef.stats.getArmourClass()) {
            const playerHealth = this.playerRef.stats.getResourceOfType(ResourceType.HEALTH);
            playerHealth.subtract(damageRoll);
            log(`PLAYER took ${damageRoll} ${damageType} damage`);
            if (playerHealth.isEmpty()) {
                this.playerRef.stats.setStatus(MobStatus.DEAD);
                log(`PLAYER has died!`);
            }
        } else {
            log(`Attack on PLAYER missed`);
        }

        await this.sleep(1000);
    }

    async playerTurn() {
        log(`PLAYER's turn`);
        //output the options the player can select;
        log(playersTurnOptionsOutput);
        let playerSelectPromise = new Promise(resolve => { this.playerCombatOptionSelected = resolve });
        let selectedOption = await playerSelectPromise.then(option => option.text);
        clearCombatOptionClass();
        switch (selectedOption.toLowerCase()) {
            case "weapons":
                await this.playerAttack();
                break;
            case "spells":
            case "items":
            // player use item, like a potion or ring or something
            case "flee":
                if (Dice.rollDice(DiceType.D20) >= 10) {
                    this.playerFled = true;
                } else {
                    log(`You try to run away, but you can't see a way out...`);
                }
                break;
        }
    }

    async playerSelectWeapon() {
        const weaponNameList = (this.playerRef.getInventory().getItemListOfType("weapon")).map(weaponObj => weaponObj.itemName);
        if (weaponNameList.length === 0) return false;
        let outString = "Select Weapon | ";
        weaponNameList.forEach(weapon => {
            outString += `<span class="combat-option">${weapon}</span> | `;
        });
        outString += backCombatOption;
        log(outString);
        let playerSelectPromise = new Promise(resolve => { this.playerCombatOptionSelected = resolve });
        return await playerSelectPromise.then(option => option.text);
    }

    async playerSelectTargets(attackType) {

        const pickRandomTargets = (numTargets, avoidSame = false) => {
            const validTargets = this.getValidTargets();
            const maxIndex = validTargets.length - 1;
            const targets = [];
            for (let i = 0; i < numTargets; i++) {
                const randomIndex = Dice.rollDice(maxIndex + 1) - 1;
                if (avoidSame && targets.includes(randomIndex)) {
                    randomIndex = randomIndex + 1 % maxIndex + 1;
                }
                targets.push(validTargets[randomIndex]);
            }
            return targets;
        };

        const [type, numTargets] = attackType.split("#", 2);
        let targets = [];
        switch (type) {
            case AttackType.SINGLE:
                let outString = "Select Target | "
                this.getValidTargets().forEach((targetIndex) => {
                    const target = this.enemies[targetIndex];
                    outString += `<span class="combat-option" data="${targetIndex}">${target.mobName}#${targetIndex}</span> | `
                });
                outString += backCombatOption;
                log(outString);
                let playerSelectPromise = new Promise(resolve => { this.playerCombatOptionSelected = resolve });
                const option = await playerSelectPromise.then(option => option);
                (option.text !== "back") ? targets.push(option.data) : targets.push(option.text);
                break;
            case AttackType.MULTI:
                targets = pickRandomTargets(numTargets, true);
                break;
            case AttackType.RANDOM:
                targets = pickRandomTargets(numTargets);
                break;
        }
        clearCombatOptionClass();
        return targets;
    }

    async playerAttack() {
        let weaponSelection = await this.playerSelectWeapon();
        clearCombatOptionClass();
        let selectBack = false;
        if (!weaponSelection) {
            log("You have no weapons!");
            selectBack = true;
        } else if (weaponSelection === "back") {
            selectBack = true;
        }

        if (selectBack) {
            await this.playerTurn();
            return false;
        }
        await this.sleep(200);
        weaponSelection = Story.getItem(weaponSelection);
        let targetIndices = await this.playerSelectTargets(weaponSelection.attackType);
        if (targetIndices.includes("back")) { await this.playerAttack(); return false; }
        log(`PLAYER used ${weaponSelection.name}`);

        let damageRoll = Dice.rollFromString(weaponSelection.damageDice).total;
        const damageType = weaponSelection.damageType;
        let attackRoll = Dice.rollDice(DiceType.D20) + this.playerRef.getStats().getAttackBonus();

        if (attackRoll === 20) { damageRoll = Math.round(damageRoll * 2); log("CRIT!"); }
        targetIndices.forEach(targetIndex => {
            const enemy = this.enemies[targetIndex];
            //TODO get the targets AC to check against
            const targetAC = enemy.stats.getArmourClass();
            if (enemy !== undefined && (attackRoll >= targetAC || attackRoll === 20)) {
                const enemyKilled = this.damageTarget(enemy, targetIndex, damageRoll, damageType);
                if (enemyKilled) {
                    log(`${enemy.mobName}#${targetIndex} died`);
                }
            } else {
                log(`Attack on ${enemy.mobName}#${targetIndex} missed`);
            }
        });
    }

    damageTarget(target, targetIndex, damage, damageType) {
        const targetHealth = target.stats.getResourceOfType(ResourceType.HEALTH);
        if (targetHealth.isEmpty()) return false;
        targetHealth.subtract(damage);
        log(`${target.mobName}#${targetIndex} took ${damage} ${damageType} damage`);
        if (targetHealth.isEmpty()) {
            target.stats.setStatus(MobStatus.DEAD);
            this.numberOfActiveMobs--;
            return true;
        } else {
            return false;
        }
    }

    end() { Game.getCurrentScene().exploreScene() }
    updateNumOfActiveMobs() { this.numberOfActiveMobs = (this.enemies.filter(mobObj => mobObj.stats.getStatus() !== MobStatus.DEAD)).length }

    getValidTargets() {
        const aliveTargetIndexArray = [];
        this.enemies.forEach((target, index) => {
            if (target.stats.getStatus() === MobStatus.ALIVE) aliveTargetIndexArray.push(index);
        });
        return aliveTargetIndexArray;
    }
    rollRoundOrder() {
        this.enemies.forEach((enemy, index) => this.roundOrder.push({ combatIndex: index, initiative: Dice.rollDice(DiceType.D20) + enemy.stats.getInitiativeBonus() }));
        this.roundOrder.push({ combatIndex: -1, initiative: Dice.rollDice(DiceType.D20) + this.playerRef.getStats().getInitiativeBonus() })
        this.roundOrder.sort((a, b) => b.initiative - a.initiative);
    }

    playerCombatOptionSelected(option) { return option }
    anyActiveMobs() { return this.numberOfActiveMobs > 0 }
    sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
}
