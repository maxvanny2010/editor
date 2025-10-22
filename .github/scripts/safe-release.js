import { execaCommandSync } from 'execa';
import fs from 'fs';

/**
 * Safe semantic-release plugin.
 * Prevents failures when a release tag already exists.
 */
function log(context, message, level = 'log') {
	const logger = context?.logger ?? console;
	if (level === 'warn') logger.warn(message);
	else if (level === 'error') logger.error(message);
	else logger.log(message);
}

export async function verifyConditions(context = {}) {
	let version = null;

	try {
		const { stdout } = execaCommandSync('git describe --tags --abbrev=0');
		version = stdout?.trim() || null;
	} catch {
		log(context, 'No existing tags found in repository.');
	}

	if (context?.nextRelease?.version) {
		version = context.nextRelease.version;
	} else if (context?.lastRelease?.version && !version) {
		version = context.lastRelease.version;
	}

	if (!version) {
		log(context, 'No version information yet — skipping tag existence check.');
		return;
	}

	const tag = `v${version}`;

	try {
		execaCommandSync(`git rev-parse ${tag}`);
		context.existingTag = true;
		log(context, `Tag ${tag} already exists.`, 'warn');
		log(context, 'Switching to noop mode — skipping release steps.');
	} catch {
		context.existingTag = false;
		log(context, `Tag ${tag} does not exist — proceeding with release.`);
	}
}

export async function prepare(context = {}) {
	if (context.existingTag) {
		log(context, 'Skipping prepare (tag already exists)');
		return;
	}
	log(context, 'Running prepare steps...');
	if (fs.existsSync('CHANGELOG.md')) {
		log(context, 'CHANGELOG.md found — continuing with changelog updates.');
	}
}

export async function publish(context = {}) {
	if (context.existingTag) {
		log(context, 'Skipping publish (tag already exists)');
		return;
	}
	log(context, 'Publishing release...');
}

export async function success(context = {}) {
	if (context.existingTag) {
		log(context, 'Tag already existed — no new release created.');
		return;
	}
	log(context, 'Release completed successfully.');
}

export async function fail(context = {}) {
	log(context, 'Release failed.', 'error');
}
