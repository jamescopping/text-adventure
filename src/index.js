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
  footer.className = "footer fixed-bottom p-3";


  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group input-group-lg";
  const placeholder = "Type your command or /help for the list of commands you can do";

  inputGroup.innerHTML += `<input type="text" id="command-input" placeholder="${placeholder}" class="form-control shadow-none"></input>`;
  inputGroup.innerHTML += `<div class="input-group-append">
    <button class="btn btn-secondary" type="button" id="command-submit">Submit</button>
  </div>`;

  footer.appendChild(inputGroup);

  return footer;
}

function adventureLog() {

  const log = document.createElement("div");
  log.className = "text-light";
  log.textContent = "This is a test"
  return log;
}

(() => {
  document.body.appendChild(adventurePage());




})();





