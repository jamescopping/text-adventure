import { commandInput, commandSubmit } from "./commandInputController";
import { game } from "../game/game";

let adventureLog;

export const initAdventureLog = () => {
  adventureLog = findAdventureLogElement();


  adventureLog.addEventListener('click', event => {
    let element = event.target;
    if (element.tagName === "SPAN" && element.className.includes("item-text")) {
      commandInput.value = `pickup ${element.textContent.substring(1, element.textContent.length - 1)}`;
      commandSubmit.click();
    } else if (element.tagName === "SPAN" && element.className.includes("response-text")) {
      game.getDialog().setResponses(getResponseMap());
      commandInput.value = `response ${element.textContent.substring(0, element.textContent.indexOf("."))}`;
      commandSubmit.click();
    }
  });
};

const findAdventureLogElement = () => document.getElementById("adventure-log");

const generateLog = text => {

  //item text styling
  text = text.replace(/(\[)/gm, `<span class="item-text font-weight-bold text-nowrap ">[`);
  text = text.replace(/(\])/gm, `]</span>`);

  text = text.replace(/(\/\*)/gm, `<span class="mob-text font-weight-bold text-nowrap ">/`);
  text = text.replace(/(\*\\)/gm, `*\\</span>`);

  const log = document.createElement("p");
  log.className = "text-monospace text-break lead";
  log.innerHTML += `<strong class="font-weight-bolder">\> </strong>`;
  log.innerHTML += text;
  return log;
};

const insertIntoAdventureLog = text => {
  adventureLog.appendChild(generateLog(text));
  adventureLog.scrollTop = adventureLog.scrollHeight;
};

export const log = text => insertIntoAdventureLog(text);

export const getResponseMap = () => {
  const responseList = document.querySelectorAll("span.response-text");
  const responseMap = new Map();
  responseList.forEach((element, index) => {
    responseMap.set((index + 1).toString(), element.getAttribute("data-nextStatementId").toString());
  });
  return responseMap;
}

export const clearResponseClass = () => {
  document.querySelectorAll("span.response-text").forEach(element => {
    element.className = element.className.replace(/\bresponse-text\b/g, "");
  })
}
