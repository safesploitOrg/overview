/* 
    This is for the future /public/assets/data/projects.json approach. 
    It skips automatically if you have not created the JSON file yet.
*/

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import {
    getProjectsJsonPath,
    getSiteRoot,
    resolveSiteAsset,
} from './helpers/sitePaths.js';

const PROJECTS_JSON_PATH = getProjectsJsonPath();
const HAS_PROJECTS_JSON = fs.existsSync(PROJECTS_JSON_PATH);

describe.skipIf(!HAS_PROJECTS_JSON)('projects.json data quality', () => {
    function loadProjects() {
        const rawJson = fs.readFileSync(PROJECTS_JSON_PATH, 'utf8');
        return JSON.parse(rawJson);
    }

    test('projects.json contains a non-empty array', () => {
        const projects = loadProjects();

        expect(Array.isArray(projects)).toBe(true);
        expect(projects.length).toBeGreaterThan(0);
    });

    test('each project has required fields', () => {
        const projects = loadProjects();

        for (const project of projects) {
            expect(project.name).toBeTruthy();
            expect(project.description).toBeTruthy();
            expect(project.url).toBeTruthy();
            expect(project.category).toBeTruthy();
            expect(project.icon).toBeTruthy();

            expect(project.url).toMatch(/^https:\/\//);
            expect(project.description.length).toBeGreaterThan(20);
        }
    });

    test('project URLs are unique', () => {
        const projects = loadProjects();
        const urls = projects.map((project) => project.url);
        const uniqueUrls = new Set(urls);

        expect(uniqueUrls.size).toBe(urls.length);
    });

    test('project names are unique', () => {
        const projects = loadProjects();
        const names = projects.map((project) => project.name.toLowerCase());
        const uniqueNames = new Set(names);

        expect(uniqueNames.size).toBe(names.length);
    });

    test('project icons exist locally when using relative paths', () => {
        const projects = loadProjects();

        for (const project of projects) {
            const icon = project.icon;

            if (icon.startsWith('http://') || icon.startsWith('https://')) {
                continue;
            }

            const iconPath = resolveSiteAsset(icon);

            expect(
                fs.existsSync(iconPath),
                `Missing icon for ${project.name}: ${path.relative(getSiteRoot(), iconPath)}`,
            ).toBe(true);
        }
    });

    test('tags are arrays when present', () => {
        const projects = loadProjects();

        for (const project of projects) {
            if (!Object.hasOwn(project, 'tags')) {
                continue;
            }

            expect(Array.isArray(project.tags)).toBe(true);

            for (const tag of project.tags) {
                expect(typeof tag).toBe('string');
                expect(tag.trim()).toBeTruthy();
            }
        }
    });
});