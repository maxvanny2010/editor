import { execaCommandSync } from 'execa';
import fs from 'fs';

/**
 * Safe semantic-release plugin
 * Prevents failures when a release tag already exists.
 */
export async function verifyConditions(context) {
	let version = null;

	try {
		const { stdout } = execaCommandSync('git describe --tags --abbrev=0');
		version = stdout?.trim() || null;
	} catch {
		context.logger.log('No existing tags found in repository.');
	}

	if (context?.nextRelease?.version) {
		version = context.nextRelease.version;
	} else if (context?.lastRelease?.version && !version) {
		version = context.lastRelease.version;
	}

	if (!version) {
		context.logger.log('No version information yet — skipping tag existence check.');
		return;
	}

	const tag = `v${version}`;

	try {
		execaCommandSync(`git rev-parse ${tag}`);

		context.existingTag = true;
		context.logger.warn(`Tag ${tag} already exists.`);
		context.logger.log('Switching to noop mode — skipping release steps.');
	} catch {
		context.existingTag = false;
		context.logger.log(`Tag ${tag} does not exist — proceeding with release.`);
	}
}

export async function prepare(context) {
	if (context.existingTag) {
		context.logger.log('Skipping prepare (tag already exists)');
		return;
	}
	context.logger.log('Running prepare steps...');
	if (fs.existsSync('CHANGELOG.md')) {
		context.logger.log('CHANGELOG.md found — continuing with changelog updates.');
	}
}

export async function publish(context) {
	if (context.existingTag) {
		context.logger.log('Skipping publish (tag already exists)');
		return;
	}
	context.logger.log('Publishing release...');
}

export async function success(context) {
	if (context.existingTag) {
		context.logger.log('Tag already existed — no new release created.');
		return;
	}
	context.logger.log('Release completed successfully.');
}

export async function fail(context) {
	context.logger.error('Release failed.');
}
