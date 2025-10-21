import { execaCommandSync } from 'execa';
import fs from 'fs';

export async function verifyConditions(context) {
	const tag = `v${context.nextRelease.version}`;
	try {
		execaCommandSync(`git rev-parse ${tag}`);
		context.existingTag = true;
		context.logger.warn(` Tag ${tag} already exists. Switching to noop mode.`);
	} catch {
		context.existingTag = false;
		context.logger.log(`Tag ${tag} does not exist — normal release.`);
	}
}

export async function prepare(context) {
	if (context.existingTag) {
		context.logger.log('Skipping prepare (tag already exists)');
		return;
	}

	context.logger.log('Running prepare steps...');
	if (fs.existsSync('CHANGELOG.md')) {
		context.logger.log(
			'CHANGELOG.md found. You can integrate changelog updates here if needed.',
		);
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
		context.logger.log(' Tag already existed — no new release created.');
		return;
	}

	context.logger.log('Release completed successfully!');
}

export async function fail(context) {
	context.logger.error(' Release failed.');
}
