// run as a privileged user
var assert = require('assert');

var chroot = require('../index');

// ensure pwd
process.env.PWD = '/var/empty';

// TODO: test with group argument
assert.throws(function() { chroot(); }, /newroot must be a string/);
assert.throws(function() { chroot('foo'); }, /user must be a string or a number/);
assert.throws(function() { chroot('foo', 'user'); }, /user not found: user/);
assert.throws(function() { chroot('foo', 'nobody'); }, /changing root failed: ENOENT, No such file or directory/);
assert.doesNotThrow(function() { chroot('/var/empty', 'nobody'); });
assert.notStrictEqual(process.getuid(), 0);
assert.notStrictEqual(process.getgid(), 0);
assert.equal(~process.getgroups().indexOf(0), false); // should not contain a root group
assert.equal(process.cwd(), '/');
assert.equal(process.env.PWD, '/');

console.log('ok');
