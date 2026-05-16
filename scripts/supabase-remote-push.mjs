#!/usr/bin/env node
/**
 * Lists local vs linked-remote migration state, then optionally runs `supabase db push`.
 * Skips db push when every local migration is already applied on the linked remote.
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

function capture(cmd) {
	return execSync(cmd, { encoding: 'utf8' });
}

/** Local migration versions not yet applied on the linked remote (empty Remote column). */
function pendingRemoteMigrations(listOutput) {
	const pending = [];
	for (const line of listOutput.split('\n')) {
		const match = line.match(/^\s*(\d{14})\s*\|\s*(\d*)\s*\|/);
		if (match && match[1] && !match[2]) {
			pending.push(match[1]);
		}
	}
	return pending;
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

let listOutput;

try {
	console.log('Checking migration status (linked remote)…\n');
	listOutput = capture('supabase migration list');
	console.log(listOutput);
} catch {
	console.error('\n Hint: Run login + link steps above if you see link/auth errors.');
	process.exitCode = 1;
	process.exit();
}

const pending = pendingRemoteMigrations(listOutput);

if (pending.length === 0) {
	console.log('Remote is up to date — no pending migrations. Skipping db push.\n');
	process.exit(0);
}

console.log(
	`\n${pending.length} migration(s) pending on remote:\n` +
		pending.map((v) => `  - ${v}`).join('\n') +
		'\n'
);

const rl = readline.createInterface({ input, output });

const reply = (
	await rl.question('Push these migrations to the linked hosted project? [y/N] ')
).trim();

rl.close();

if (!/^y(es)?$/i.test(reply)) {
	console.log('Skipped (no db push).\n');
	process.exit(0);
}

console.log('\nRunning supabase db push…\n');
run('supabase db push');
console.log('\nDone.\n');
