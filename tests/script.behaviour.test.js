import fs from "node:fs";
import { describe, expect, test } from "vitest";
import { JSDOM } from "jsdom";
import { getScriptPath } from "./helpers/sitePaths.js";

function createDom() {
	return new JSDOM(
		`
        <!DOCTYPE html>
        <html lang="en-GB">
            <body>
                <button class="dropdown-btn" type="button" aria-expanded="false">Useful Resources</button>
                <div id="dropdownMenu" class="dropdown-content"></div>
                <span id="currentYear"></span>
            </body>
        </html>
        `,
		{
			runScripts: "outside-only",
			url: "https://git.safesploit.com/",
		},
	);
}

function loadScript(dom) {
	const script = fs.readFileSync(getScriptPath(), "utf8");
	dom.window.eval(script);

	dom.window.document.dispatchEvent(
		new dom.window.Event("DOMContentLoaded", {
			bubbles: true,
			cancelable: true,
		}),
	);
}

describe("frontend JavaScript behaviour", () => {
	test("script.js exists and is not empty", () => {
		expect(fs.existsSync(getScriptPath())).toBe(true);

		const script = fs.readFileSync(getScriptPath(), "utf8");
		expect(script.trim().length).toBeGreaterThan(0);
	});

	test("sets the current year after DOMContentLoaded", () => {
		const dom = createDom();
		loadScript(dom);

		const expectedYear = String(new Date().getFullYear());
		const yearElement = dom.window.document.getElementById("currentYear");

		expect(yearElement.textContent).toBe(expectedYear);
	});

	test("toggleDropdown() toggles the dropdown menu visibility class", () => {
		const dom = createDom();
		loadScript(dom);

		const dropdownMenu = dom.window.document.getElementById("dropdownMenu");

		expect(typeof dom.window.toggleDropdown).toBe("function");
		expect(dropdownMenu.classList.contains("show")).toBe(false);

		dom.window.toggleDropdown();
		expect(dropdownMenu.classList.contains("show")).toBe(true);

		dom.window.toggleDropdown();
		expect(dropdownMenu.classList.contains("show")).toBe(false);
	});

	test("clicking outside the dropdown closes it", () => {
		const dom = createDom();
		loadScript(dom);

		const dropdownMenu = dom.window.document.getElementById("dropdownMenu");

		dropdownMenu.classList.add("show");
		expect(dropdownMenu.classList.contains("show")).toBe(true);

		dom.window.document.body.dispatchEvent(
			new dom.window.MouseEvent("click", {
				bubbles: true,
				cancelable: true,
			}),
		);

		expect(dropdownMenu.classList.contains("show")).toBe(false);
	});

	test("clicking the dropdown button does not immediately close the dropdown", () => {
		const dom = createDom();
		loadScript(dom);

		const button = dom.window.document.querySelector(".dropdown-btn");
		const dropdownMenu = dom.window.document.getElementById("dropdownMenu");

		dropdownMenu.classList.add("show");

		button.dispatchEvent(
			new dom.window.MouseEvent("click", {
				bubbles: true,
				cancelable: true,
			}),
		);

		expect(dropdownMenu.classList.contains("show")).toBe(false);
	});
});
