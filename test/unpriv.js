// run as an unprivileged user
var assert = require('assert');

var chroot = require('../index');

assert.throws(function() { chroot(); }, /provide newroot/);
assert.throws(function() { chroot('foo'); }, /provide user/);
assert.throws(function() { chroot('foo', 'nobody'); }, /chroot must be called while running as root/);

console.log('ok');
