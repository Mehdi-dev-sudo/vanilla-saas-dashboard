/**
 * compile-tokens.mjs — Compiles tokens/tokens.json into:
 *   1. css/tokens.css  (CSS custom properties for light + dark)
 *   2. js/tokens.js    (JS module for runtime access)
 *
 * Usage: node tokens/compile-tokens.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load tokens ───────────────────────────────────────────
const tokens = JSON.parse(readFileSync(resolve(ROOT, 'tokens', 'tokens.json'), 'utf-8'));

// ── Collect CSS custom properties ─────────────────────────
const lightProps = [];
const darkProps = [];
const rawTokens = {};
const tokenDoc = [];

function walk(obj, prefix) {
  for (const [key, val] of Object.entries(obj)) {
    if (!val || typeof val !== 'object') continue;
    if ('value' in val) {
      const name = `--ds-${prefix}${key}`.replace(/_/g, '-').replace(/([A-Z])/g, '-$1').toLowerCase();
      lightProps.push({ name, value: val.value });
      if (val.dark) darkProps.push({ name, value: val.dark });
      rawTokens[name] = val.value;
      tokenDoc.push({ name, value: val.value, dark: val.dark || null, description: val.description || '' });
    } else {
      walk(val, `${prefix}${key}-`);
    }
  }
}

walk(tokens, '');

// ── Write CSS ──────────────────────────────────────────────
const header = `/* ===================================================
   Design Tokens — Auto-generated from tokens/tokens.json
   DO NOT EDIT DIRECTLY — edit tokens.json and recompile
   =================================================== */`;

const lightCSS = lightProps.map(p => `  ${p.name}: ${p.value};`).join('\n');
const darkCSS = darkProps.map(p => `  ${p.name}: ${p.value};`).join('\n');

const css = `${header}

@layer tokens {
  :root {
${lightCSS}
  }

  [data-theme="dark"] {
${darkCSS}
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
${darkCSS}
    }
  }

  /* Token documentation — used by Design System page */
  :root::after {
    display: none;
    content: ${JSON.stringify(JSON.stringify(tokenDoc))};
  }
}
`;

const cssDir = resolve(ROOT, 'css');
mkdirSync(cssDir, { recursive: true });
writeFileSync(resolve(cssDir, 'tokens.css'), css, 'utf-8');
console.log('✓ css/tokens.css written');

// ── Write JS token module ──────────────────────────────────
const js = `/**
 * Design Tokens — Auto-generated from tokens/tokens.json
 * DO NOT EDIT DIRECTLY
 */

const DesignTokens = (function () {
  const tokens = ${JSON.stringify(rawTokens, null, 2)};

  function get(name) {
    return tokens[name] || null;
  }

  function getAll() {
    return { ...tokens };
  }

  function getDoc() {
    return ${JSON.stringify(tokenDoc, null, 2)};
  }

  return { get, getAll, getDoc };
})();
`;

const jsDir = resolve(ROOT, 'js');
mkdirSync(jsDir, { recursive: true });
writeFileSync(resolve(jsDir, 'tokens.js'), js, 'utf-8');
console.log('✓ js/tokens.js written');
