# chroot

Safely chroot the current process and drop privileges.

## Example

Bind a TCP server to a privileged port, chroot and drop privileges to "wwwuser".

```js
var net = require('net');
var chroot = require('chroot');

var server = net.createServer();
server.listen(80, function(err) {
  if (err) { throw err; }

  try {
    chroot('/var/empty', 'wwwuser');
    console.log('changed root to "/var/empty" and user to "wwwuser"');
  } catch(err) {
    console.error('changing root or user failed', err);
    process.exit(1);
  }
});
```

Note: the process must be started as the super user.

## Installation

    $ npm install chroot

## API

### chroot(newRoot, user, [group])
* newRoot {String} The path to the new root directory for this process. The
       whole path should be owned by the super user and may not be writable by
       the group owner or others.
* user {String|Number} The user to switch to after changing the root directory.
       Can be either a name or a numeric id.
* group {String|Number} The group to switch to after changing the root
       directory. Can be either a name or a numeric id. If omitted the default
       is to set all the groups the user is a member of (see /etc/groups) plus
       the primary group of the user (see /etc/passwd).

Change the root directory of the current process. A normal user must be provided
since changing root without dropping privileges makes no sense from a security
point of view.

## Notes
* The current working dir is updated to "/".
* If the environment variable PWD is set, it will be updated to "/".
* Open file descriptors are not closed and environment variables and argv are
  not cleared, use `child_process.fork()` to accomplish that.

## General chroot notes
Chrooting a program is not a security solution. It is only one aspect of the
much broader principle of least privilege. When done right it can be used as a
mitigation to seriously hinder a compromised process in further compromising the
system. Keep the following things in mind when setting up and using a chroot:

* Anything that is stored in the chroot can be used against you. Use an empty
  non-writable directory if possible.
* Include modules before chrooting.
* Create a separate user account used only for running the chrooted process.
* Use child_process.fork() to clear the environment and close file descriptors.

Further reading:
* [http://www.unixwiz.net/techtips/chroot-practices.html](http://www.unixwiz.net/techtips/chroot-practices.html)
* [http://www.dwheeler.com/secure-programs/Secure-Programs-HOWTO/minimize-privileges.html](http://www.dwheeler.com/secure-programs/Secure-Programs-HOWTO/minimize-privileges.html)

## License

ISC

Copyright (c) 2014, 2015, 2021 Tim Kuijsten

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
