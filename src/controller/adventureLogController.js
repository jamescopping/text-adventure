let adventureLog;

export function initAdventreLog() {
    adventureLog = findAdventureLogElement();
}

function findAdventureLogElement() {
    return document.getElementById("adventure-log");
}

function generateLog(text) {
    const log = document.createElement("p");
    log.className = "text-monospace text-break lead";
    log.innerHTML +=
        `<strong class="font-weight-bolder">\> </strong>`;
    log.innerHTML += text;
    return log;
}

function insertIntoAdventureLog(element) {
    adventureLog.appendChild(element);
    adventureLog.scrollTop = adventureLog.scrollHeight;
}

export function log(text) {
    insertIntoAdventureLog(generateLog(text));
}