import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';


function adventurePage() {
  const main = document.createElement("main");
  main.setAttribute("role", "main");
  main.className = "bg-dark p-3";
  const container = document.createElement("div");
  container.className = "full-height";


  container.appendChild(adventureLog());
  container.appendChild(commandArea());
  container.appendChild(suggestionBox());
  main.appendChild(container);

  return main;
}

function commandArea() {

  const footer = document.createElement('footer');
  footer.className = "footer p-3";


  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group input-group-lg";
  const placeholder = "Type your command or /help for the list of commands you can do";

  inputGroup.innerHTML += `<input type="text" id="command-input" placeholder="${placeholder}" class="form-control shadow-none" autocomplete="off"></input>`;
  inputGroup.innerHTML += `<div class="input-group-append">
    <input class="btn btn-secondary" type="submit" id="command-submit"></input>
  </div>`;

  footer.appendChild(inputGroup);

  return footer;
}

function adventureLog() {
  const log = document.createElement("div");
  log.id = "adventure-log";
  log.className = "text-light shadow p-3 mx-3 bg-secondary border border-light rounded";


  const commandText = document.createElement("div");
  commandText.style = "none";
  commandText.id = "command-text";

  log.appendChild(commandText);
  return log;
}

function suggestionBox() {
  const suggestionBox = document.createElement("div");
  suggestionBox.id = "suggestion-box";
  suggestionBox.className = "position-absolute dropdown-menu dropright text-light rounded-0 border border-secondary border-bottom-0";
  return suggestionBox;
}



(() => {
  document.body.appendChild(adventurePage());

  const adventureLog = document.getElementById("adventure-log");
  const commandInput = document.getElementById("command-input");
  const commandSubmit = document.getElementById("command-submit");
  const suggestionBox = document.getElementById("suggestion-box");
  const commandText = document.getElementById("command-text")


  insertIntoAdventureLog(generateLog("Hello This is a text adventure game, currently work in progress!"));


  const commandList = ["inventory", "stats", "goto", "look", "investigate", "talkto", "pickup", "attack", "loot", "cast"];
  let entityList = [{ "name": "barry" }, { "name": "jonny" }, { "name": "harry" }, { "name": "james" }, { "name": "billy" }, { "name": "duck" }, { "name": "bluekey" }];
  let suggestions = [];

  commandInput.addEventListener('input', (event) => {
    let value = commandInput.value;
    if (value !== "") {

      if (value.includes(" ") && value.split(" ")[1] !== null) {
        let entityPart = value.split(" ")[1];
        console.log(entityPart);
        suggestions = entityList.filter((entityRef) => {
          return entityRef.name.startsWith(commandInput.value.toLowerCase());
        });
      } else {
        suggestions = commandList.filter((command) => {
          return command.startsWith(commandInput.value.toLowerCase());
        });
      }
      if (suggestions.length === 0) {
        suggestions.push("no such command/obj ref");
      }
      suggestionBox.innerHTML = "";
      suggestions.forEach(element => {
        const suggestion = document.createElement("p");
        suggestion.className = "dropdown-item";
        suggestion.innerHTML = element;
        suggestionBox.appendChild(suggestion);
      });
      suggestionBox.style.display = "block";

      commandText.textContent = value;

      let topOffset = commandInput.getBoundingClientRect().top;
      let leftOffset = commandInput.getBoundingClientRect().left;
      let suggestionBoxHeight = suggestionBox.getBoundingClientRect().height;



      suggestionBox.style.top = `${topOffset - suggestionBoxHeight - 1}px`;
      suggestionBox.style.left = `${leftOffset + 25 + commandText.clientWidth}px`;

    } else {
      suggestionBox.style.display = "none";

    }

  });


  function generateLog(text) {
    const log = document.createElement("p");
    log.className = "text-monospace text-break lead";

    log.innerHTML += `<strong class="font-weight-bolder">\> </strong>`;
    log.innerHTML += text;
    return log;
  }

  function insertIntoAdventureLog(element) {
    adventureLog.appendChild(element);
    adventureLog.scrollTop = adventureLog.scrollHeight;
  }
})();





