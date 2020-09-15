import { MobStatus } from "./definitions";
import { Game, GameMode, game } from "./game";
import { log, clearPathClass } from "../controller/adventureLogController";
import { Dice, DiceType } from "./dice";
import { Scene } from "./scene";

const playersTurnOptionsOutput = `Select Action | <span class="combat-option">Attack</span> | <span class="combat-option">Item</span> | <span class="combat-option">Spell</span> | <span class="combat-option">Flee</span> |`;
const backCombatOption = `<span class="combat-option">back</span> |`;

const AttackType = {
    SINGLE: 'single',
    MULTI: 'multi',
    RANDOM: 'random'
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
        this.enemies = Game.getCurrentScene().getMobs().filter(mobObj => mobObj.status === MobStatus.ALIVE && mobObj.type === "enemy");
        if (this.enemies.length === 0) return false;
        this.rollRoundOrder();
        let outString = "Combat order: ";
        this.roundOrder.forEach((obj, index) => {
            const combatIndex = obj.combatIndex;
            outString += (combatIndex === -1) ? "PLAYER" : this.enemies[combatIndex].mobName;
            if (index < this.roundOrder.length - 1) outString += " => ";
        });
        log(outString);
        await this.loop();
    }

    async loop() {
        this.numberOfActiveMobs = this.enemies.length;
        while (!this.playerFled && this.playerRef.isAlive() && this.anyActiveMobs()) {
            log(`!!Round ${this.roundNumber++} of Combat!!`);
            for (const { combatIndex, initiative } of this.roundOrder) {
                if (this.playerFled) break;
                (combatIndex < 0) ? await this.playerTurn() : await this.enemyTurn(combatIndex);
            }
            this.updateNumOfActiveMobs();
        }

        if (this.playerRef.isAlive() && !this.playerFled && this.anyActiveMobs() === 0) {
            log("Combat is over!");
        } else if (this.playerRef.isAlive() && this.playerFled) {
            log(`You successfully escape from combat!`);
            Game.changeScene(Scene.getLastSceneName());
        }
        this.end();
    }

    async enemyTurn(combatIndex) {
        const enemy = this.enemies[combatIndex];
        log(`${enemy.mobName}'s turn`);
        await this.sleep(1000 + Dice.rollNDice(10, DiceType.D100).total);

        //figure out what the enemy can do.. 


        //then do it...


        log(`${enemy.mobName} does something blah blah blah`);
        await this.sleep(1000);
    }

    async playerTurn() {
        log(`PLAYER's turn`);
        //output the options the player can select;
        log(playersTurnOptionsOutput);
        let playerSelectPromise = new Promise(resolve => { this.playerCombatOptionSelected = resolve });
        let selectedOption = await playerSelectPromise.then(option => option);
        switch (selectedOption.toLowerCase()) {
            case "attack":
                await this.playerAttack();
                break;
            case "spell":
            case "item":
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
            outString += `<span class="combat-option">${weapon}</span> |`;
        });
        outString += backCombatOption;
        log(outString);
        let playerSelectPromise = new Promise(resolve => { this.playerCombatOptionSelected = resolve });
        return await playerSelectPromise.then(option => option);
    }

    async playerSelectTargets(attackType) {
        const targets = [];
        return targets;
    }

    async playerAttack() {
        let weaponSelection = await this.playerSelectWeapon();
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

        //find the type of weapon, single, multi, random
        let targets = await this.playerSelectTargets(AttackType.SINGLE);
        console.log(weaponSelection);
    }



    end() { Game.getCurrentScene().exploreScene() }
    updateNumOfActiveMobs() { this.numberOfActiveMobs = (this.enemies.filter(mobObj => mobObj.status !== MobStatus.DEAD)).length }

    rollRoundOrder() {
        this.enemies.forEach((enemy, index) => this.roundOrder.push({ combatIndex: index, initiative: Dice.rollDice(DiceType.D20) + enemy.stats.getInitiativeBonus() }));
        this.roundOrder.push({ combatIndex: -1, initiative: Dice.rollDice(DiceType.D20) + this.playerRef.getStats().getInitiativeBonus() })
        this.roundOrder.sort((a, b) => b.initiative - a.initiative);
    }

    playerCombatOptionSelected(option) { return option }
    anyActiveMobs() { return this.numberOfActiveMobs > 0 }
    sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
}
