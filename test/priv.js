/**
 * Copyright (c) 2014, 2015 Tim Kuijsten
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

'use strict';

// run as a privileged user
var assert = require('assert');
var fs = require('fs');
var os = require('os');

var chroot = require('../index');

if (process.getuid() !== 0) {
  console.error('run these privileged tests as user root');
  process.exit(1);
}

// ensure pwd
process.env.PWD = '/var/empty';

// TODO: test with group argument
assert.throws(function() { chroot(); }, /newroot must be a string/);
assert.throws(function() { chroot('foo'); }, /user must be a string or a number/);
assert.throws(function() { chroot('foo', 'user'); }, /user not found: user/);
assert.throws(function() { chroot('foo', 'nobody'); }, /ENOENT: no such file or directory/);

// create a root owned directory that is not writable for the group or others, but
// has ancestors that fail this criteria (/tmp)
var tmpsubdir = fs.realpathSync(os.tmpdir()) + '/chroot-permission-test';
try {
  fs.mkdirSync(tmpsubdir, '0755');
} catch(err) {
  if (err.code !== 'EEXIST') {
    throw err;
  }

  // recreate to ensure permissions
  fs.rmdirSync(tmpsubdir);
  fs.mkdirSync(tmpsubdir, '0755');
}

// should complain about writable by group or others on the ancestor of tmpsubdir
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + fs.realpathSync(os.tmpdir()) + ' owner: 0 or permissions: \\d+77$'));

// should complain about writable by group on tmpsubdir itself
fs.chmodSync(tmpsubdir, '720');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+720$'));
fs.chmodSync(tmpsubdir, '730');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+730$'));
fs.chmodSync(tmpsubdir, '760');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+760$'));
fs.chmodSync(tmpsubdir, '770');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+770$'));

// should complain about writable by others on tmpsubdir itself
fs.chmodSync(tmpsubdir, '702');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+702$'));
fs.chmodSync(tmpsubdir, '703');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+703$'));
fs.chmodSync(tmpsubdir, '706');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+706$'));
fs.chmodSync(tmpsubdir, '707');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+707$'));

// should complain about writable for both group and others on tmpsubdir itself
fs.chmodSync(tmpsubdir, '773');
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 0 or permissions: \\d+773$'));

// restore permissions
fs.chmodSync(tmpsubdir, '755');

// should complain about owner not being root
fs.chownSync(tmpsubdir, 1, 1);
assert.throws(function() { chroot(tmpsubdir, 'nobody'); }, new RegExp('^Error: bad chroot dir ' + tmpsubdir + ' owner: 1 or permissions: \\d+755$'));

assert.doesNotThrow(function() { chroot('/var/empty', 'nobody'); });
assert.notStrictEqual(process.getuid(), 0);
assert.notStrictEqual(process.getgid(), 0);
assert.equal(~process.getgroups().indexOf(0), false); // should not contain a root group
assert.equal(process.cwd(), '/');
assert.equal(process.env.PWD, '/');

console.log('ok');
