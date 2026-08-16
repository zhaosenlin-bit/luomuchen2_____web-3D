/**
 * Deploy the current project to GitHub Pages (gh-pages branch).
 *
 * Strategy:
 *   1. Copy source files into a temp build dir (outside the repo).
 *   2. Rewrite every `/cartoon/` asset path to `/luomuchen2_____web-3D/`
 *      (GitHub Pages serves the repo at `https://<user>.github.io/<repo>/`).
 *   3. Build with `vite build` (base `/luomuchen2_____web-3D/`, outDir `dist`).
 *   4. Replace the gh-pages branch contents with the built output and push.
 *
 * Run from the project root:
 *   node scripts/deploy-ghpages.cjs
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const REPO_SLUG = 'luomuchen2_____web-3D';
const BASE_PATH = `/${REPO_SLUG}/`;
const FROM_PREFIX = '/cartoon/';

const TMP = path.join(os.tmpdir(), `deploy-${REPO_SLUG}-${Date.now()}`);
const GHPAGES_WT = path.join(os.tmpdir(), `ghpages-${REPO_SLUG}-${Date.now()}`);

const run = (cmd, cwd) => {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash' });
};

const copyRecursive = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'dist') continue;
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
};

const rewritePaths = (dir, from, to) => {
  let total = 0;
  let files = 0;
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name === 'dist') continue;
        walk(full);
      } else if (/\.(jsx|js|scss|html|css|json|svg|cjs|mjs)$/.test(ent.name)) {
        let txt = fs.readFileSync(full, 'utf8');
        if (txt.includes(from)) {
          const n = txt.split(from).length - 1;
          txt = txt.split(from).join(to);
          fs.writeFileSync(full, txt, 'utf8');
          total += n;
          files++;
        }
      }
    }
  };
  walk(dir);
  return { total, files };
};

const linkNodeModules = (tmpDir) => {
  const nmSrc = path.join(REPO_ROOT, 'node_modules');
  if (!fs.existsSync(nmSrc)) return false;
  const nmDst = path.join(tmpDir, 'node_modules');
  try {
    if (process.platform === 'win32') {
      run(`mklink /J "${nmDst}" "${nmSrc}"`, tmpDir);
    } else {
      fs.symlinkSync(nmSrc, nmDst, 'dir');
    }
    return true;
  } catch (e) {
    console.log('  (node_modules link failed, will npm install)');
    return false;
  }
};

const main = () => {
  try {
    console.log('=== 1/4  Copy source to temp dir ===');
    copyRecursive(REPO_ROOT, TMP);

    console.log('\n=== 2/4  Rewrite asset paths ===');
    const { total, files } = rewritePaths(path.join(TMP, 'src'), FROM_PREFIX, BASE_PATH);
    const vcPath = path.join(TMP, 'vite.config.js');
    let vc = fs.readFileSync(vcPath, 'utf8');
    vc = vc.replace("base: '/cartoon/',", `base: '${BASE_PATH}',`);
    vc = vc.replace("outDir: 'dist/cartoon',", "outDir: 'dist',");
    fs.writeFileSync(vcPath, vc, 'utf8');
    console.log(`  rewrote ${total} occurrences in ${files} source files + vite.config.js`);

    console.log('\n=== 3/4  Build production bundle ===');
    const linked = linkNodeModules(TMP);
    if (!linked) {
      run('npm install --no-audit --no-fund --silent', TMP);
    }
    run('npm run build', TMP);

    console.log('\n=== 4/4  Update gh-pages branch ===');
    run(`git worktree add ${GHPAGES_WT} gh-pages`, REPO_ROOT);
    // Remove everything except .git
    for (const ent of fs.readdirSync(GHPAGES_WT)) {
      if (ent === '.git') continue;
      fs.rmSync(path.join(GHPAGES_WT, ent), { recursive: true, force: true });
    }
    // Copy built output
    copyRecursive(path.join(TMP, 'dist'), GHPAGES_WT);
    run('git add -A && git commit -m "Deploy: ' + new Date().toISOString().slice(0, 10) + ' production build" && git push origin gh-pages', GHPAGES_WT);

    console.log('\n✅ Deploy complete: https://zhaosenlin-bit.github.io/' + REPO_SLUG + '/');
  } catch (err) {
    console.error('\n❌ Deploy failed:', err.message);
    process.exitCode = 1;
  } finally {
    // Cleanup temp dirs + worktree
    try { if (fs.existsSync(GHPAGES_WT)) run(`git worktree remove ${GHPAGES_WT} --force`, REPO_ROOT); } catch {}
    try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(GHPAGES_WT, { recursive: true, force: true }); } catch {}
  }
};

main();
