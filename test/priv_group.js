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

var user  = 'nobody';
var group = 'nobody';

// ensure pwd
process.env.PWD = '/var/empty';

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

assert.doesNotThrow(function() { chroot('/var/empty', user, group); });
assert.notStrictEqual(process.getuid(), 0);
assert.notStrictEqual(process.getgid(), 0);
assert.equal(~process.getgroups().indexOf(0), false); // should not contain a root group
assert.equal(process.cwd(), '/');
assert.equal(process.env.PWD, '/');

console.log('ok');
