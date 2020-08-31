export const loadSuggestionBox = () => {
	const suggestionBox = document.createElement("div");
	suggestionBox.id = "suggestion-box";
	suggestionBox.className = "position-absolute suggestion-menu";
	return suggestionBox;
}