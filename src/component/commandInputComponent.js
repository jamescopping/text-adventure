export function loadCommandInput() {

    const footer = document.createElement('footer');
    footer.className = "footer p-3";

    const commandTextWidth = document.createElement("div");
    commandTextWidth.style = "none";
    commandTextWidth.id = "command-text-width";
    footer.appendChild(commandTextWidth);

    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group input-group-lg";
    const placeholder = "{command} {operand}";

    inputGroup.innerHTML +=
        `<input type="text" id="command-input" placeholder="${placeholder}" class="form-control shadow-none" autocomplete="off"></input>`;
    inputGroup.innerHTML +=
        `<div class="input-group-append">
      <input class="btn btn-secondary" type="submit" id="command-submit"></input>
    </div>`;

    footer.appendChild(inputGroup);

    return footer;
}


