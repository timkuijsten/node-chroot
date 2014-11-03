// run as an unprivileged user
var assert = require('assert');

var chroot = require('../index');

assert.throws(function() { chroot({}); }, /newroot must be a string/);
assert.throws(function() { chroot('foo'); }, /user must be a string or a number/);
assert.throws(function() { chroot('foo', 'bar', {}); }, /group must be a string or a number/);
assert.throws(function() { chroot('', 'bar'); }, /newroot must contain at least one character/);
assert.throws(function() { chroot('foo', ''); }, /user must contain at least one character/);
assert.throws(function() { chroot('foo', 'root'); }, /user can not be root or 0/);
assert.throws(function() { chroot('foo', 0); }, /user can not be root or 0/);
assert.throws(function() { chroot('foo', 'bar', 'root'); }, /group can not be root or 0/);
assert.throws(function() { chroot('foo', 'bar', 0); }, /group can not be root or 0/);
assert.throws(function() { chroot('foo', 'nobody'); }, /chroot must be called while running as root/);

console.log('ok');
