export function loadSuggestionBox() {
  const suggestionBox = document.createElement("div");
  suggestionBox.id = "suggestion-box";
  suggestionBox.className = "position-absolute dropdown-menu dropright text-light rounded-0 border border-secondary border-bottom-0";
  return suggestionBox;
}