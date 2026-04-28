import { existsSync, copyFileSync, unlinkSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PACKS_DIR = join(ROOT, '.kilo', 'rules', 'packs');
const RULES_DIR = join(ROOT, '.kilo', 'rules');
const PREFIX_START = 20;
const PREFIX_END = 29;

function usage() {
  console.log('Usage:');
  console.log('  node scripts/activate-rules.mjs <pack...>         Activate one or more packs');
  console.log('  node scripts/activate-rules.mjs --deactivate <pack>  Deactivate a pack');
  console.log('  node scripts/activate-rules.mjs --force <pack...>    Overwrite active rule if present');
  console.log('  node scripts/activate-rules.mjs --list                List available packs');
  console.log('  node scripts/activate-rules.mjs --status              Show active/inactive status');
  process.exit(1);
}

function listPacks() {
  if (!existsSync(PACKS_DIR)) {
    console.log('No packs directory found.');
    return [];
  }
  return readdirSync(PACKS_DIR).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
}

function activePacks() {
  if (!existsSync(RULES_DIR)) return [];
  return readdirSync(RULES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const match = f.match(/^(\d+)-(.+)\.md$/);
      return match ? { prefix: parseInt(match[1], 10), name: match[2], file: f } : null;
    })
    .filter(Boolean);
}

function deactivate(name) {
  const active = activePacks();
  const entry = active.find(p => p.name === name);
  if (!entry) {
    console.log(`Pack "${name}" is not active.`);
    return;
  }
  const filePath = join(RULES_DIR, entry.file);
  unlinkSync(filePath);
  console.log(`Deactivated: ${entry.file}`);
}

function activate(names, force) {
  const packs = listPacks();
  const active = activePacks();
  const usedPrefixes = new Set(active.map(p => p.prefix));
  const usedNames = new Set(active.map(p => p.name));

  let nextPrefix = PREFIX_START;
  function getNextPrefix() {
    while (usedPrefixes.has(nextPrefix) && nextPrefix <= PREFIX_END) {
      nextPrefix++;
    }
    if (nextPrefix > PREFIX_END) {
      console.error('Error: No available prefix slots (20-29). Deactivate a pack first.');
      process.exit(1);
    }
    return nextPrefix++;
  }

  for (const name of names) {
    if (!packs.includes(name)) {
      console.error(`Error: Pack "${name}" not found in ${PACKS_DIR}`);
      console.error(`Available packs: ${packs.join(', ')}`);
      process.exit(1);
    }

    if (usedNames.has(name)) {
      if (force) {
        const existing = active.find(p => p.name === name);
        const filePath = join(RULES_DIR, existing.file);
        unlinkSync(filePath);
        console.log(`Overwriting: ${existing.file}`);
        usedPrefixes.delete(existing.prefix);
        nextPrefix = Math.min(nextPrefix, existing.prefix);
      } else {
        console.log(`Skipping "${name}" — already active. Use --force to overwrite.`);
        continue;
      }
    }

    const prefix = getNextPrefix();
    const targetName = `${prefix}-${name}.md`;
    const src = join(PACKS_DIR, `${name}.md`);
    const dest = join(RULES_DIR, targetName);

    copyFileSync(src, dest);
    console.log(`Activated: ${targetName}`);
    usedPrefixes.add(prefix);
    usedNames.add(name);
  }
}

function showStatus() {
  const packs = listPacks();
  const active = activePacks();
  const activeNames = new Set(active.map(p => p.name));

  console.log('\nRule Packs status:\n');
  for (const name of packs) {
    const isActive = activeNames.has(name);
    const entry = isActive ? active.find(p => p.name === name) : null;
    const mark = isActive ? '\x1b[32mactive\x1b[0m' : '\x1b[90minactive\x1b[0m';
    const detail = entry ? ` (${entry.file})` : '';
    console.log(`  ${mark} ${name}${detail}`);
  }
}

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  usage();
}

if (args.includes('--list')) {
  const packs = listPacks();
  console.log(`Available packs: ${packs.join(', ')}`);
  process.exit(0);
}

if (args.includes('--status')) {
  showStatus();
  process.exit(0);
}

if (args.includes('--deactivate')) {
  const idx = args.indexOf('--deactivate');
  const names = args.slice(idx + 1).filter(a => !a.startsWith('--'));
  if (names.length === 0) usage();
  for (const name of names) {
    deactivate(name);
  }
  process.exit(0);
}

const force = args.includes('--force');
const names = args.filter(a => !a.startsWith('--'));

if (names.length === 0) usage();

activate(names, force);
