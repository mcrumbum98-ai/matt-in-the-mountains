import { mkdir, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const dist = join(root, 'dist');

const pages = [
  'index.html',
  'about.html',
  'gear.html',
  'journal.html',
  'photography.html',
  'photo-collection.html',
  'article.html',
  'project.html'
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const page of pages) {
  await cp(join(root, page), join(dist, page));
}

await cp(join(root, 'assets'), join(dist, 'assets'), {
  recursive: true
});

await mkdir(join(dist, 'gear', 'reviews'), { recursive: true });
await mkdir(join(dist, 'journal', 'posts'), { recursive: true });

console.log('Building published Basecamp content...');

execFileSync('node', [join(root, 'scripts', 'build-content.mjs')], {
  cwd: dist,
  stdio: 'inherit'
});

execFileSync('node', [join(root, 'scripts', 'build-journal.mjs')], {
  cwd: dist,
  stdio: 'inherit'
});

execFileSync('node', [join(root, 'scripts', 'apply-content-layout.mjs')], {
  cwd: dist,
  stdio: 'inherit'
});

console.log('\nDeployment prepared successfully in dist/');
