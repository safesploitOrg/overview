const DROPDOWN_VISIBLE_CLASS = "show";
const DROPDOWN_BUTTON_SELECTOR = ".dropdown-btn";
const CURRENT_YEAR_ID = "currentYear";

const initialisedDropdownButtons = new WeakSet();
let areGlobalDropdownListenersInitialised = false;

function setCurrentYear() {
	const yearElement = document.getElementById(CURRENT_YEAR_ID);

	if (!yearElement) {
		return;
	}

	yearElement.textContent = String(new Date().getFullYear());
}

function getDropdownButtons() {
	return [...document.querySelectorAll(DROPDOWN_BUTTON_SELECTOR)];
}

function getControlledMenu(dropdownButton) {
	const menuId = dropdownButton?.getAttribute("aria-controls");

	return menuId ? document.getElementById(menuId) : null;
}

function closeDropdowns(exceptButton = null) {
	for (const dropdownButton of getDropdownButtons()) {
		if (dropdownButton === exceptButton) {
			continue;
		}

		getControlledMenu(dropdownButton)?.classList.remove(
			DROPDOWN_VISIBLE_CLASS,
		);
		dropdownButton.setAttribute("aria-expanded", "false");
	}
}

function toggleDropdown(dropdownButton = getDropdownButtons()[0]) {
	const dropdownMenu = getControlledMenu(dropdownButton);

	if (!dropdownButton || !dropdownMenu) {
		return;
	}

	const willOpen = !dropdownMenu.classList.contains(DROPDOWN_VISIBLE_CLASS);
	closeDropdowns(dropdownButton);
	dropdownMenu.classList.toggle(DROPDOWN_VISIBLE_CLASS, willOpen);
	dropdownButton.setAttribute("aria-expanded", String(willOpen));
}

function handleDocumentClick(event) {
	if (!event.target.closest?.(".dropdown")) {
		closeDropdowns();
	}
}

function handleDocumentKeydown(event) {
	if (event.key === "Escape") {
		closeDropdowns();
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

function initialiseDropdownButtons() {
	for (const dropdownButton of getDropdownButtons()) {
		if (initialisedDropdownButtons.has(dropdownButton)) {
			continue;
		}

		dropdownButton.addEventListener("click", () => {
			toggleDropdown(dropdownButton);
		});
		initialisedDropdownButtons.add(dropdownButton);
	}
}

function initialiseSite() {
	setCurrentYear();
	initialiseDropdownButtons();
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
window.closeDropdown = closeDropdowns;
window.initialiseSite = initialiseSite;
