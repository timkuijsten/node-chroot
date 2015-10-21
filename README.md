# chroot

Securely chroot the current process and drop privileges.

## Example

Bind a TCP server to a privileged port before dropping privileges.

    var net = require('net');
    var chroot = require('chroot');

    var server = net.createServer();
    server.listen(80, function(err) {
      if (err) { throw err; }

      try {
        chroot('/var/empty', 'nobody');
        console.log('changed root to "/var/empty" and user to "nobody"');
      } catch(err) {
        console.error('changing root or user failed', err);
        process.exit(1);
      }
    });

Note: the process must be started as the super user.

## Installation

    $ npm install chroot

## API

### chroot(newRoot, user, [group])
* newRoot {String} The path to the new root directory for this process. The
       whole path should be owned by the super user and may not be writable by
       the group owner or others.
* user {String|Number} The user to switch to after changing the root directory.
       Can be either a name or an id.
* group {String|Number} The group to switch to after changing the root
       directory. Can be either a name or an id of any group the user belongs to
       (see /etc/groups). Defaults to the users primary group (see /etc/passwd).

Change the root directory of the current process. A normal user must be provided
since changing root without dropping privileges makes no sense from a security
point of view.

## Notes
* The current working dir is updated to "/".
* If the environment variable PWD is set, it will be updated to "/".
* Open file descriptors are not closed and environment variables and argv are
  not cleared, use `child_process.fork()` to accomplish that.

## General chroot tips
* Apply the principle of least privilege to anything that must reside in the
  chroot and the user that privileges are dropped to.
* Put as little as possible inside the chroot, so include modules before
  chrooting.
* Create a separate user account used only for running the chrooted process.
* Try to avoid or minimize writable paths, or make it writable for the separate
  user only.
* Realize that any code in a chroot must be maintained.
* Avoid hard links to any other path outside the chroot.
* Don't store any setuid or setgid binaries inside the chroot.

## License

ISC

Copyright (c) 2014, 2015 Tim Kuijsten

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
