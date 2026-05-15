#!/usr/bin/env node
/**
 * Lists local vs linked-remote migration state, then optionally runs `supabase db push`.
 *
 * One-time prerequisites (interactive; run from repo root):
 *   npm run supabase:remote:login
 *   npm run supabase:remote:link -- --project-ref <your-project-ref>
 *
 * Requires Supabase CLI on PATH (`supabase --version`).
 */
import { execSync } from 'node:child_process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

function run(cmd) {
	execSync(cmd, { stdio: 'inherit' });
}

console.log(`
TapTapTidy — push migrations to hosted Supabase
-----------------------------------------------
Before this script succeeds, link the repo once to your hosted project:

  npm run supabase:remote:login
  npm run supabase:remote:link -- --project-ref <reference-id>

  Reference ID: Dashboard → Project Settings → General ("Reference ID").
  The CLI may ask for the database password — never commit it.

`);

try {
	run('supabase migration list');
} catch {
	console.error('\n Hint: Run login + link steps above if you see link/auth errors.');
	process.exitCode = 1;
	process.exit();
}

const rl = readline.createInterface({ input, output });

const reply = (
	await rl.question('\n Push pending migrations to the linked hosted project? [y/N] ')
).trim();

rl.close();

if (!/^y(es)?$/i.test(reply)) {
	console.log('Skipped (no db push).\n');
	process.exit(0);
}

console.log('');
run('supabase db push');
console.log('\n Done.\n');
