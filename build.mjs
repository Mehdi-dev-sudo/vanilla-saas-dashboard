import * as esbuild from 'esbuild';
import { readdirSync, statSync, cpSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, 'js');
const outRoot = join(__dirname, 'dist', 'js');

function collectFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const full = join(dir, file);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(collectFiles(full));
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      results.push(full);
    }
  }
  return results;
}

async function build() {
  // Step 0: Compile design tokens
  spawnSync('node', [join(__dirname, 'tokens', 'compile-tokens.mjs')], { stdio: 'inherit' });

  const entryPoints = collectFiles(srcRoot);
  await esbuild.build({
    entryPoints,
    outdir: outRoot,
    bundle: false,
    target: 'es2020',
    tsconfig: join(__dirname, 'tsconfig.json'),
    outbase: srcRoot,
    allowOverwrite: true,
  });

  // Concat CSS
  const cssSrc = join(__dirname, 'css');
  const cssDst = join(__dirname, 'dist', 'css');
  if (!existsSync(cssDst)) mkdirSync(cssDst, { recursive: true });

  const cssOrder = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'utilities.css', 'responsive.css', 'main.css'];
  const concatCss = [];
  const cssFiles = readdirSync(cssSrc);
  for (const name of cssOrder) {
    if (cssFiles.includes(name)) {
      concatCss.push(`/* ---- ${name} ---- */\n` + readFileSync(join(cssSrc, name), 'utf8'));
    }
  }
  writeFileSync(join(cssDst, 'main.css'), concatCss.join('\n\n'));

  // Copy index.html, stripping "dist/" prefix from paths for dist/ serving
  const htmlPath = join(__dirname, 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf8');
  const distHtml = htmlContent
    .replace(/(src|href)="dist\//g, '$1="')
    .replace(/\?v=\d+/g, '');
  writeFileSync(join(__dirname, 'dist', 'index.html'), distHtml);

  // Copy non-TypeScript JS assets
  for (const f of ['manifest.json', 'sw.js']) {
    try { cpSync(join(__dirname, f), join(__dirname, 'dist', f)); } catch (e) {}
  }
  try { cpSync(join(__dirname, 'js', 'tokens.js'), join(__dirname, 'dist', 'js', 'tokens.js')); } catch (e) {}

  console.log('Build complete: dist/');
}

const isWatch = process.argv.includes('--watch');
if (isWatch) {
  const ctx = await esbuild.context({
    entryPoints: collectFiles(srcRoot),
    outdir: outRoot,
    bundle: false,
    target: 'es2020',
    tsconfig: join(__dirname, 'tsconfig.json'),
    outbase: srcRoot,
    allowOverwrite: true,
  });
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  build().catch((e) => { console.error('Build failed:', e); process.exit(1); });
}
