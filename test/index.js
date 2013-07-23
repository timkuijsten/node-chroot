var assert = require('assert');

var chroot = require('../index');

// TODO: test with group argument
assert.throws(function() { chroot(); }, /provide newroot/);
assert.throws(function() { chroot('foo'); }, /provide user/);
if (process.getuid() === 0) {
  assert.throws(function() { chroot('foo', 'user'); }, /user not found: user/);
  assert.throws(function() { chroot('foo', 'nobody'); }, /changing root failed: ENOENT, No such file or directory/);
  assert.doesNotThrow(function() { chroot('/tmp', 'nobody'); });
  assert.notStrictEqual(process.getuid(), 0);
  assert.notStrictEqual(process.getgid(), 0);
  assert.equal(~process.getgroups().indexOf(0), false); // should not contain a root group
} else {
  assert.throws(function() { chroot('foo', 'nobody'); }, /chroot must be called while running as root/);
}

console.log('ok');
