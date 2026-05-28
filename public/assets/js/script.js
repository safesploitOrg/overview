const DROPDOWN_VISIBLE_CLASS = "show";
const DROPDOWN_BUTTON_SELECTOR = ".dropdown-btn";
const DROPDOWN_MENU_ID = "dropdownMenu";
const CURRENT_YEAR_ID = "currentYear";

let isDropdownButtonInitialised = false;
let areGlobalDropdownListenersInitialised = false;

function setCurrentYear() {
	const yearElement = document.getElementById(CURRENT_YEAR_ID);

	if (!yearElement) {
		return;
	}

	yearElement.textContent = String(new Date().getFullYear());
}

function getDropdownMenu() {
	return document.getElementById(DROPDOWN_MENU_ID);
}

function getDropdownButton() {
	return document.querySelector(DROPDOWN_BUTTON_SELECTOR);
}

function setDropdownExpanded(isExpanded) {
	const dropdownButton = getDropdownButton();

	if (!dropdownButton) {
		return;
	}

	dropdownButton.setAttribute("aria-expanded", String(isExpanded));
}

function toggleDropdown() {
	const dropdownMenu = getDropdownMenu();

	if (!dropdownMenu) {
		return;
	}

	const isNowExpanded = dropdownMenu.classList.toggle(DROPDOWN_VISIBLE_CLASS);
	setDropdownExpanded(isNowExpanded);
}

function closeDropdown() {
	const dropdownMenu = getDropdownMenu();

	if (!dropdownMenu) {
		return;
	}

	dropdownMenu.classList.remove(DROPDOWN_VISIBLE_CLASS);
	setDropdownExpanded(false);
}

function handleDocumentClick(event) {
	const dropdownMenu = getDropdownMenu();
	const dropdownButton = getDropdownButton();

	if (!dropdownMenu || !dropdownButton) {
		return;
	}

	const clickedInsideMenu = dropdownMenu.contains(event.target);
	const clickedButton = dropdownButton.contains(event.target);

	if (!clickedInsideMenu && !clickedButton) {
		closeDropdown();
	}
}

function handleDocumentKeydown(event) {
	if (event.key === "Escape") {
		closeDropdown();
	}
}

function initialiseGlobalDropdownListeners() {
	if (areGlobalDropdownListenersInitialised) {
		return;
	}

	document.addEventListener("click", handleDocumentClick);
	document.addEventListener("keydown", handleDocumentKeydown);

	areGlobalDropdownListenersInitialised = true;
}

function initialiseDropdownButton() {
	const dropdownButton = getDropdownButton();

	if (!dropdownButton || isDropdownButtonInitialised) {
		return;
	}

	dropdownButton.addEventListener("click", (event) => {
		event.stopPropagation();
		toggleDropdown();
	});

	isDropdownButtonInitialised = true;
}

function initialiseSite() {
	setCurrentYear();
	initialiseDropdownButton();
	initialiseGlobalDropdownListeners();
}

initialiseGlobalDropdownListeners();

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initialiseSite, {
		once: true,
	});
} else {
	initialiseSite();
}

window.setCurrentYear = setCurrentYear;
window.toggleDropdown = toggleDropdown;
window.closeDropdown = closeDropdown;
window.initialiseSite = initialiseSite;
