let alertElement, alertText;
let alertType;

export const initAlert = () => {
    alertElement = findAlertElement();
    alertText = findAlertTextElement();
    alertType = "alert-primary";
    bindEventListeners();
}

const findAlertElement = () => document.getElementById("alert");

const findAlertTextElement = () => document.getElementById("alert");

const bindEventListeners = () => {
    alertElement.addEventListener("click", () => {
        hideAlert();
    });
}

export const triggerAlert = (newType, text) => {
    changeAlertType(newType);
    alertText.innerHTML = text;
    showAlert();
}

const showAlert = () => alertElement.style.display = "block";
const hideAlert = () => alertElement.style.display = "none";

export const changeAlertType = newType => {
    alertElement.classList.replace(alertType, newType);
    alertType = newType;
}
