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
  return log;
}



(() => {
  document.body.appendChild(adventurePage());

  const adventureLog = document.getElementById("adventure-log");
  const commandInput = document.getElementById("command-input");
  const commandSubmit = document.getElementById("command-submit");


  insertIntoAdventureLog(generateLog("Hello This is a text adventure game, currently work in progress!"));


  const commandList = ["inventory", "stats", "goto", "look", "investigate", "talkto", "pickup", "attack", "loot", "cast"];



  commandInput.addEventListener('input', (event) => {








    const autocompleteList = commandList.filter((command) => {
      return command.startsWith(commandInput.value.toLowerCase());
    });
    autocompleteList.forEach((command) => {
      insertIntoAdventureLog(generateLog(command));
    });
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





