import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { JSDOM } from "jsdom";
import { readIndexHtml } from "./helpers/sitePaths.js";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");
const LINKINATOR_CONFIG_PATH = path.join(
	PROJECT_ROOT,
	"linkinator.config.json",
);
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, "package.json");

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

describe("link checker configuration", () => {
	test("uses the Linkinator config instead of command-line skip overrides", () => {
		const packageJson = readJson(PACKAGE_JSON_PATH);

		expect(packageJson.scripts["check:links"]).not.toContain("--skip");
		expect(fs.existsSync(LINKINATOR_CONFIG_PATH)).toBe(true);
	});

	test("skips private repository links but still checks public repositories", () => {
		const config = readJson(LINKINATOR_CONFIG_PATH);
		const skipPatterns = config.skip.map((pattern) => new RegExp(pattern));
		const document = new JSDOM(readIndexHtml()).window.document;
		const repositoryLinks = [
			...document.querySelectorAll("#repositoriesMenu a[href]"),
		];

		for (const link of repositoryLinks) {
			const href = link.getAttribute("href");
			const isPrivate = link.textContent.trim().startsWith("🔒");
			const isSkipped = skipPatterns.some((pattern) =>
				pattern.test(href),
			);

			expect(isSkipped, `${href} has the wrong Linkinator status`).toBe(
				isPrivate,
			);
		}
	});
});
