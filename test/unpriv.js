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

// run as an unprivileged user
var assert = require('assert');

var chroot = require('../index');

if (process.getuid() === 0) {
  console.error('don\'t run these unprivileged tests as user root');
  process.exit(1);
}

assert.throws(function() { chroot({}); }, /newRoot must be a string/);
assert.throws(function() { chroot('foo'); }, /user must be a string or a number/);
assert.throws(function() { chroot('foo', 'bar', {}); }, /group must be a string or a number/);
assert.throws(function() { chroot('', 'bar'); }, /newRoot must contain at least one character/);
assert.throws(function() { chroot('foo', ''); }, /user must contain at least one character/);
assert.throws(function() { chroot('foo', 'nobody'); }, /chroot must be called while running as root/);

console.log('ok');
