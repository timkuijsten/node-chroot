# chroot

Safely chroot the current process and drop privileges.

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

Note: in order to change user the process must be started as the super user.

## Installation

    $ npm install chroot

## API

### chroot(newroot, user, [group])
* newroot {String}  the path of the new root for this process. the whole path
      should be owned by root and may not be writable by the group or others
* user {String|Number}  the user name or id to switch to after changing the root
      path
* group {String|Number}  the group name or id to switch to after changing the
      root, defaults to the groups the user is in (using /etc/groups)

Change the root of the current process. A normal user must be provided since
changing root without dropping privileges makes no sense from a security point
of view.

## Notes
* the current working dir is set to "/" in the new chroot
* if the environment variable PWD is set, it will be reset to "/"
* open file descriptors are not closed and environment variables and argv are
  not cleared, use `child_process.fork()` to accomplish that.

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
