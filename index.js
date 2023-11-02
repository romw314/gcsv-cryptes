#!/usr/bin/env node
const pkg = require('./package.json');
const fs = require('fs');
const Cryptr = require('cryptr');
const { prompts } = require('prompts');

console.log('gcsv-cryptes by romw314 v' + pkg.version);

const config = (() => {
	const commentRegex = /(;|#).*$/;

	let conf1;
	try {
		conf1 = fs.readFileSync('gcsv.conf', 'utf8').replace('\r', '').split('\n');
	}
	catch {
		conf1 = [];
	}
	const conf2 = conf1.map(line => line.trim());
	const conf3 = conf2.filter(line => !(line.startsWith('#') || line.startsWith(';') || line === ''));
	const conf4 = conf3.map(line => line.replace(commentRegex, ''));
	const conf5 = conf4.map(line => line.split('='));
	const conf6 = conf5.map(opt => [opt[0], opt.slice(1).join('=')]);
	let result = { outfile: 'main.csv' };
	for (const [name, value] of conf6)
		result[name] = value;
	if (!result.infile)
		result.infile = result.outfile + '.genc';
	return result;
})();

const _decrypt = ({ decrypt }) => fs.writeFileSync(config.outfile, decrypt(fs.readFileSync(config.infile, 'utf8')));
const _encrypt = ({ encrypt }) => fs.writeFileSync(config.infile, encrypt(fs.readFileSync(config.outfile, 'utf8')));
const _wrap = (func) => (password) => {
	if (typeof(password) === 'string')
		return func(new Cryptr(password));
	else
		return func(password);
};

if (!module.parent)
	(async () => {
		const cryptr = new Cryptr(await prompts.password({ message: 'Enter password' }));
		if (await prompts.select({
			message: 'Choose the mode',
			choices: [
				{ title: 'Encrypt', description: `Encrypt ${config.outfile} into ${config.infile}`, value: false },
				{ title: 'Decrypt', description: `Decrypt ${config.infile} into ${config.outfile}`, value: true }
			],
			initial: 1
		}))
			_decrypt(cryptr);
		else
			_encrypt(cryptr);
	})();

module.exports = { encrypt: _wrap(_encrypt), decrypt: _wrap(_decrypt) };
