import { commandInput } from "./commandInputController";

let adventureLog;

export const initAdventureLog = () => {
  adventureLog = findAdventureLogElement();


  adventureLog.addEventListener('click', event => {
    console.log(event);
    console.log(event.target.tagName);
    let element = event.target;
    if (element.tagName === "SPAN" && element.className.includes("item-text")) {
      commandInput.value += element.textContent.substring(1, element.textContent.length - 1);
    }
  });
};

const findAdventureLogElement = () => document.getElementById("adventure-log");

const generateLog = text => {

  //item text styling
  text = text.replace(/[[]/gm, `<span class="item-text font-weight-bold text-nowrap ">[`);
  text = text.replace(/]/gm, `]</span>`);

  const log = document.createElement("p");
  log.className = "text-monospace text-break lead";
  log.innerHTML += `<strong class="font-weight-bolder">\> </strong>`;
  log.innerHTML += text;
  return log;
};

const insertIntoAdventureLog = (text) => {
  adventureLog.appendChild(generateLog(text));
  adventureLog.scrollTop = adventureLog.scrollHeight;
};

export const log = (text) => insertIntoAdventureLog(text);
