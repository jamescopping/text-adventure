let adventureLog;

export const initAdventreLog = () => {
    adventureLog = findAdventureLogElement();
}

const findAdventureLogElement = () => document.getElementById("adventure-log");

const generateLog = text => {
    const log = document.createElement("p");
    log.className = "text-monospace text-break lead";
    log.innerHTML +=
        `<strong class="font-weight-bolder">\> </strong>`;
    log.innerHTML += text;
    return log;
}

const insertIntoAdventureLog = element => {
    adventureLog.appendChild(element);
    adventureLog.scrollTop = adventureLog.scrollHeight;
}

export const log = text => insertIntoAdventureLog(generateLog(text));
