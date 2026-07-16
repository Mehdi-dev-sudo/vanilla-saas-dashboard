import * as esbuild from 'esbuild';
import { readdirSync, statSync, cpSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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

  // Copy CSS
  const cssDst = join(__dirname, 'dist', 'css');
  if (!existsSync(cssDst)) mkdirSync(cssDst, { recursive: true });
  cpSync(join(__dirname, 'css'), cssDst, { recursive: true });

  // Copy index.html, stripping "dist/" prefix from paths for dist/ serving
  const htmlPath = join(__dirname, 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf8');
  const distHtml = htmlContent.replace(/(src|href)="dist\//g, '$1="');
  writeFileSync(join(__dirname, 'dist', 'index.html'), distHtml);

  // Copy manifest.json and sw.js
  for (const f of ['manifest.json', 'sw.js']) {
    try { cpSync(join(__dirname, f), join(__dirname, 'dist', f)); } catch (e) {}
  }

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
