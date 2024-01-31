let data = null;
let indata = null;
global._gcsvtes_fs = { writeFileSync: (_,d) => data = d, readFileSync: () => indata };
console._log = console.log;
console.log = () => {};
const { encrypt, decrypt } = require('./index.js');
console.log = console._log;

test('Sanity check', () => expect(true).toBe(true));
test('Encrypt/Decrypt', () => {
	for (const input in ['gadaafd', 'gsfqaaaa', 'gcsv-cryptes', 'uuuuuuiiiiii', 't4391111\n\r\x1B']) {
		indata = input;
		encrypt('mysecretpassword');
		indata = data;
		decrypt('mysecretpassword');
		expect(data).toBe(input);
	}
});
