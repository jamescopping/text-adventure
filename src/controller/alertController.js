let alertElement, alertText;
let alertType;

export function initAlert() {
    alertElement = findAlertElement();
    alertText = findAlertTextElement();
    alertType = "alert-primary";
    bindEventListeners();
}

function findAlertElement() {
    return document.getElementById("alert");
}

function findAlertTextElement() {
    return document.getElementById("alert");
}

function bindEventListeners() {
    alertElement.addEventListener("click", () => {
        hideAlert();
    });
}

export function triggerAlert(newType, text) {
    changeAlertType(newType);
    alertText.innerHTML = text;
    showAlert();
}

function showAlert() {
    alertElement.style.display = "block";
}
function hideAlert() {
    alertElement.style.display = "none";
}

export function changeAlertType(newType) {
    alertElement.classList.replace(alertType, newType);
    alertType = newType;
}
