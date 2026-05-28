import fs from 'node:fs';
import path from 'node:path';

export const REPO_ROOT = process.cwd();

export function getSiteRoot() {
    const publicRoot = path.join(REPO_ROOT, 'public');
    const publicIndex = path.join(publicRoot, 'index.html');

    if (fs.existsSync(publicIndex)) {
        return publicRoot;
    }

    return REPO_ROOT;
}

export function getIndexPath() {
    return path.join(getSiteRoot(), 'index.html');
}

export function getAssetsPath() {
    return path.join(getSiteRoot(), 'assets');
}

export function getScriptPath() {
    return path.join(getAssetsPath(), 'js', 'script.js');
}

export function getProjectsJsonPath() {
    return path.join(getAssetsPath(), 'data', 'projects.json');
}

export function readIndexHtml() {
    return fs.readFileSync(getIndexPath(), 'utf8');
}

export function resolveSiteAsset(relativePath) {
    return path.join(getSiteRoot(), relativePath);
}