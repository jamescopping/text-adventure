
export function loadAlert() {
    const alert = document.createElement("div");
    alert.className = "alert position-fixed alert-primary alert-dismissible fade show";
    alert.setAttribute("role", "alert");
    alert.id = "alert";
    alert.innerHTML = `<p id="alert-text"></p>`;
    alert.style.display = "none";
    alert.style.right = "2.5rem";
    return alert;
}


