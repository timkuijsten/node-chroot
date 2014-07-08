// run as a privileged user
var assert = require('assert');

var chroot = require('../index');

var fs = require('fs');

process.stdout.resume();

// before the chroot
assert.doesNotThrow(function() {  fs.fstatSync(0); });
assert.doesNotThrow(function() {  fs.fstatSync(1); });
assert.doesNotThrow(function() {  fs.fstatSync(2); });
assert.doesNotThrow(function() {  fs.fstatSync(3); });
assert.doesNotThrow(function() {  fs.fstatSync(4); });
assert.doesNotThrow(function() {  fs.fstatSync(5); });
assert.doesNotThrow(function() {  fs.fstatSync(6); });
assert.doesNotThrow(function() {  fs.fstatSync(7); });
assert.doesNotThrow(function() {  fs.fstatSync(8); });
assert.doesNotThrow(function() {  fs.fstatSync(9); });
assert.doesNotThrow(function() {  fs.fstatSync(10); });
assert.doesNotThrow(function() {  fs.fstatSync(11); });

// chroot
assert.doesNotThrow(function() { chroot('/tmp', 'nobody'); });

for (var i = 0; i < 12; i++) {
  try {
    var stat = fs.fstatSync(i);
    if (i>2 && i != 6) {
      fs.closeSync(i);
    }
  } catch(err) {
    console.log(err, i);
  }
}

// after the chroot
assert.doesNotThrow(function() {  fs.fstatSync(0); });
assert.doesNotThrow(function() {  fs.fstatSync(1); });
assert.doesNotThrow(function() {  fs.fstatSync(2); });
assert.throws(function() { fs.fstatSync(3); }, /EBADF, bad file descriptor/);
assert.throws(function() { fs.fstatSync(4); }, /EBADF, bad file descriptor/);
assert.throws(function() { fs.fstatSync(5); }, /EBADF, bad file descriptor/);
assert.doesNotThrow(function() {  fs.fstatSync(6); });
assert.throws(function() { fs.fstatSync(7); }, /EBADF, bad file descriptor/);
assert.throws(function() { fs.fstatSync(8); }, /EBADF, bad file descriptor/);
assert.throws(function() { fs.fstatSync(9); }, /EBADF, bad file descriptor/);
assert.throws(function() { fs.fstatSync(10); }, /EBADF, bad file descriptor/);
assert.throws(function() { fs.fstatSync(11); }, /EBADF, bad file descriptor/);

//assert.equal(process.env.PWD, '/');
//assert.equal(process.env.PWD, '/');
//var stat = fs.fstatSync(10);
//console.log(10, stat);

console.log('ok');
