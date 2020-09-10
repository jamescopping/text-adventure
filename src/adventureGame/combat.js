import { MobStatus } from "./definitions";
import { Game, GameMode, game } from "./game";
import { log, clearPathClass } from "../controller/adventureLogController";
import { Dice, DiceType } from "./dice";
import { Scene } from "./scene";

const playersTurnOptionsOutput = `Select Option: <span class="combat-option">Attack</span> | <span class="combat-option">Item</span> | <span class="combat-option">Spell</span> | <span class="combat-option">Flee</span>`;
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
        this.end();
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
        log("Combat is over!");
    }

    async enemyTurn(combatIndex) {
        const enemy = this.enemies[combatIndex];
        log(`${enemy.mobName}'s turn`);
        await this.sleep(1000 + Dice.rollNDice(10, DiceType.D100).total);

        //figure out what the enemy can do.. 


        //then do it...


        log(`${enemy.mobName} does something blah blah blah`);
        await this.sleep(500);
    }

    async playerTurn() {
        log(`PLAYER's turn`);
        //output the options the player can select;
        log(playersTurnOptionsOutput);
        const playerSelectPromise = new Promise(resolve => { this.playerCombatOptionSelected = resolve });
        const selectedOption = await playerSelectPromise.then(option => option);
        switch (selectedOption.toLowerCase()) {
            case "attack":
            case "spell":
            case "item":
            case "flee":
                if (Dice.rollDice(DiceType.D20) >= 10) {
                    log(`You successfully escape from combat!`);
                    this.playerFled = true;
                    Game.changeScene(Scene.getLastSceneName());
                } else {
                    log(`You try to run away, but you can't see a way out...`);
                }
                break;
        }
    }

    end() {
        //save the states of the mobs that were in the combat
        Game.getCurrentScene().exploreScene();
    }

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