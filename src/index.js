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
  container.appendChild(warningAlert());
  main.appendChild(container);

  return main;
}

function warningAlert() {

  const warningAlert = document.createElement("div");
  warningAlert.className = "alert position-fixed alert-warning alert-dismissible fade show";
  warningAlert.setAttribute("role", "alert");
  warningAlert.id = "warningAlert";
  warningAlert.innerHTML = `<p id="warningAlertText"><strong>Holy guacamole!</strong> You should check in on some of those fields below.</p>`;
  warningAlert.style.display = "none";
  return warningAlert;

}

function commandArea() {

  const footer = document.createElement('footer');
  footer.className = "footer p-3";


  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group input-group-lg";
  const placeholder = "Type your command or /help for the list of commands you can do";

  inputGroup.innerHTML +=
    `<input type="text" id="command-input" placeholder="${placeholder}" class="form-control shadow-none" autocomplete="off"></input>`;
  inputGroup.innerHTML +=
    `<div class="input-group-append">
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
  const commandText = document.getElementById("command-text");
  const warningAlert = document.getElementById("warningAlert");

  insertIntoAdventureLog(generateLog("Hello This is a text adventure game, currently work in progress!"));

  const commandList = ["/help", "/save", "inventory", "stats", "goto", "look", "investigate", "talkto", "pickup", "attack", "loot", "cast"];
  let entityList = ["barry", "jonny", "harry", "james", "billy", "duck", "bluekey"];
  let suggestions = [];
  let previousCommands = [];

  const validKeys = (keycode) => {
    return (keycode > 47 && keycode < 58) || // number keys
      (keycode == 32) || // spacebar & return key(s) (if you want to allow carriage returns)
      (keycode > 64 && keycode < 91) || // letter keys
      (keycode > 95 && keycode < 112) || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      (keycode > 218 && keycode < 223); // [\]' (in order)
  }

  commandSubmit.onclick = submitCommandInput;
  commandInput.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (validKeys(event.keyCode)) {
      commandInput.value += event.key;
      handleTextCommandInput(commandInput.value);
    } else {
      switch (event.key) {
        case "Enter":
          submitCommandInput();
          break;
        case "ArrowUp":
          console.log("arrow up");
          break;
        case "ArrowDown":
          console.log("arrow down");
          break;
        case "ArrowRight":
          console.log("arrow right");
          break;
        case "ArrowLeft":
          console.log("arrow left");
          break;
        case "Tab":
          console.log("tab");
          break;
        case "Backspace":
          let value = commandInput.value;
          if (value.length > 0) {
            commandInput.value = value.substring(0, value.length - 1);
            handleTextCommandInput(commandInput.value);
          }
          break;
      }
    }
  });

  document.querySelector("#warningAlert").addEventListener("click", () => {
    warningAlert.style.display = "none";
  });

  function submitCommandInput() {

    if (suggestions[0] !== "[Error]") {
      validateCommand(splitCommand(commandInput.value));
      commandInput.value = "";
      suggestionBox.style.display = "none";
    } else {
      commandInput.classList.add("is-invalid");
    }
  }

  function handleTextCommandInput(value) {
    if (value !== "") {
      commandInput.classList.remove("is-invalid");
      if (value.includes(" ")) {
        let command = splitCommand(value);

        if (commandList.includes(command.action)) {
          switch (command.action) {
            default:
              suggestions = entityList.filter((entityRef) => {
                return entityRef.startsWith(command.operand);
              });
              break;
          }
          if (suggestions.length === 0) {
            suggestions.push("no such entity");
          }
        } else {
          suggestions[0] = "[Error]";
        }
      } else {
        suggestions = commandList.filter((command) => {
          return command.startsWith(value.toLowerCase());
        });
        if (suggestions.length === 0) {
          suggestions[0] = "[Error]";
          suggestions.push("Command does NOT exist");
        }
      }

      commandText.textContent = value;
      updateSuggestionBox();
      displaySuggestionBox();
    } else {
      suggestionBox.style.display = "none";
    }
  }

  function updateSuggestionBox() {
    suggestionBox.innerHTML = "";
    suggestions.forEach(element => {
      const suggestion = document.createElement("p");
      suggestion.className = "dropdown-item";
      suggestion.innerHTML = element;
      suggestionBox.appendChild(suggestion);
    });
  }

  function displaySuggestionBox() {
    suggestionBox.style.display = "block";
    let topOffset = commandInput.getBoundingClientRect().top;
    let leftOffset = commandInput.getBoundingClientRect().left;
    let suggestionBoxHeight = suggestionBox.getBoundingClientRect().height;
    suggestionBox.style.top = `${topOffset - suggestionBoxHeight - 1}px`;
    suggestionBox.style.left = `${leftOffset + 25 + commandText.clientWidth}px`;
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

  function validateCommand(command) {
    switch (command.action) {
      case "":
        document.getElementById("warningAlertText").innerText = "you have to enter something in the input box!";
        warningAlert.style.display = "block";
        break
      case "/help":
        help();
        break;
      default:
        insertIntoAdventureLog(generateLog(`${command.action} ${command.operand} [this command is yet to be implemented!]`));
        break;
    }
  }

  function help() {
    commandList.forEach(element => {
      insertIntoAdventureLog(generateLog(`${element} `));
    });
  }

  function splitCommand(string) {
    string = string.toLowerCase();
    return { action: string.split(" ")[0], operand: string.split(" ")[1] };
  }
})();





