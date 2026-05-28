import { describe, expect, test } from 'vitest';
import { JSDOM } from 'jsdom';
import { readIndexHtml } from './helpers/sitePaths.js';

function getDocument() {
    return new JSDOM(readIndexHtml()).window.document;
}

describe('static site security checks', () => {
    test('external links use HTTPS', () => {
        const document = getDocument();
        const links = [...document.querySelectorAll('a[href]')];

        for (const link of links) {
            const href = link.getAttribute('href');

            if (!href) {
                continue;
            }

            if (
                href.startsWith('#') ||
                href.startsWith('/') ||
                href.startsWith('mailto:')
            ) {
                continue;
            }

            expect(href, `Non-HTTPS link found: ${href}`).toMatch(/^https:\/\//);
        }
    });

    test('target="_blank" links protect against tabnabbing', () => {
        const document = getDocument();
        const blankLinks = [...document.querySelectorAll('a[target="_blank"]')];

        expect(blankLinks.length).toBeGreaterThan(0);

        for (const link of blankLinks) {
            const href = link.getAttribute('href');
            const rel = link.getAttribute('rel') || '';
            const relValues = rel.toLowerCase().split(/\s+/);

            expect(
                relValues,
                `Missing noopener on target="_blank" link: ${href}`,
            ).toContain('noopener');

            expect(
                relValues,
                `Missing noreferrer on target="_blank" link: ${href}`,
            ).toContain('noreferrer');
        }
    });

    test('images have useful alt text', () => {
        const document = getDocument();
        const images = [...document.querySelectorAll('img')];

        for (const image of images) {
            const src = image.getAttribute('src');
            const alt = image.getAttribute('alt') || '';

            expect(alt.trim(), `Missing alt text for image: ${src}`).toBeTruthy();
        }
    });

    test('page does not use inline event handlers', () => {
        const document = getDocument();
        const elements = [...document.querySelectorAll('*')];

        const inlineEventHandlers = [];

        for (const element of elements) {
            for (const attribute of element.getAttributeNames()) {
                if (attribute.toLowerCase().startsWith('on')) {
                    inlineEventHandlers.push({
                        tag: element.tagName.toLowerCase(),
                        attribute,
                    });
                }
            }
        }

        expect(inlineEventHandlers).toEqual([]);
    });
});