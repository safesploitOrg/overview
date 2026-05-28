import fs from 'node:fs';
import { describe, expect, test } from 'vitest';
import { JSDOM } from 'jsdom';
import {
    getIndexPath,
    readIndexHtml,
    resolveSiteAsset,
} from './helpers/sitePaths.js';

function getDocument() {
    const html = readIndexHtml();
    return new JSDOM(html).window.document;
}

describe('static site structure', () => {
    test('index.html exists', () => {
        expect(fs.existsSync(getIndexPath())).toBe(true);
    });

    test('page has expected core metadata', () => {
        const document = getDocument();

        expect(document.querySelector('html')?.getAttribute('lang')).toBeTruthy();
        expect(document.querySelector('meta[charset]')).toBeTruthy();
        expect(document.querySelector('meta[name="viewport"]')).toBeTruthy();

        const title = document.querySelector('title')?.textContent?.trim();
        expect(title).toBeTruthy();
        expect(title.toLowerCase()).toContain('safesploit');
    });

    test('page has a primary heading and description', () => {
        const document = getDocument();

        const heading = document.querySelector('h1')?.textContent?.trim();
        const description = document.querySelector('.description')?.textContent?.trim();

        expect(heading).toBeTruthy();
        expect(heading.toLowerCase()).toContain('safesploit');
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(40);
    });

    test('project cards have href, image, heading, and description', () => {
        const document = getDocument();
        const cards = [...document.querySelectorAll('a.card')];

        expect(cards.length).toBeGreaterThan(0);

        for (const card of cards) {
            const href = card.getAttribute('href');
            const image = card.querySelector('img');
            const heading = card.querySelector('h2');
            const description = card.querySelector('p');

            expect(href).toBeTruthy();
            expect(href).toMatch(/^https:\/\//);

            expect(image).toBeTruthy();
            expect(image?.getAttribute('src')).toBeTruthy();
            expect(image?.getAttribute('alt')).toBeTruthy();

            expect(heading?.textContent?.trim()).toBeTruthy();
            expect(description?.textContent?.trim()).toBeTruthy();
        }
    });

    test('all local images referenced by the page exist', () => {
        const document = getDocument();
        const images = [...document.querySelectorAll('img')];

        expect(images.length).toBeGreaterThan(0);

        for (const image of images) {
            const src = image.getAttribute('src');

            if (!src || src.startsWith('http://') || src.startsWith('https://')) {
                continue;
            }

            const imagePath = resolveSiteAsset(src);
            expect(fs.existsSync(imagePath), `Missing image: ${src}`).toBe(true);
        }
    });

    test('stylesheet and script files referenced by the page exist', () => {
        const document = getDocument();

        const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"]')];
        const scripts = [...document.querySelectorAll('script[src]')];

        expect(stylesheets.length).toBeGreaterThan(0);
        expect(scripts.length).toBeGreaterThan(0);

        for (const stylesheet of stylesheets) {
            const href = stylesheet.getAttribute('href');
            expect(href).toBeTruthy();
            expect(fs.existsSync(resolveSiteAsset(href))).toBe(true);
        }

        for (const script of scripts) {
            const src = script.getAttribute('src');
            expect(src).toBeTruthy();
            expect(fs.existsSync(resolveSiteAsset(src))).toBe(true);
        }
    });
});