import { MobStatus } from "./definitions";
import { Game, GameMode } from "./game";
import { log } from "../controller/adventureLogController";

export class Combat {
    constructor() {
        this.reset();
    }

    reset() {
        this.enemies = [];
        this.roundNumber = 0;
    }

    start() {
        Game.changeGameMode(GameMode.COMBAT);
        log("Combat started!");
        this.enemies = Game.getCurrentScene().getMobs().filter(mobObj => mobObj.status === MobStatus.ALIVE && mobObj.type === "enemy");
        if (this.enemies.length === 0) return false;
        let outString = "Enemy List: ";
        this.enemies.forEach((mobObj, index) => {
            outString += mobObj.mobName;
            if (index < this.enemies.length - 1) outString += ", ";
        });
        log(outString);
        this.loop();
        this.end();
    }

    loop() {
        let numberOfActiveMobs = this.enemies.length;
        const updateNumOfActiveMobs = () => {
            numberOfActiveMobs = (this.enemies.filter(mobObj => mobObj.status !== MobStatus.DEAD)).length;
        }
        const player = Game.getPlayer();
        console.log(this.enemies)
        //combat is active while player is alive and there are active mobs to fight



        // while (player.isAlive() && numberOfActiveMobs > 0) {

        //     console.log("This is true");





        //     updateNumOfActiveMobs();
        // }
    }

    end() {
        //save the states of the mobs that were in the combat
    }
}