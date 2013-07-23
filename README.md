# chroot

Small utility to chroot and change privileges.

## Usage

    var chroot = require('chroot');

    // change root to "/var/empty" and user to "nobody"
    try {
      chroot('/var/empty', 'nobody');
    } catch(e) {
      console.log('changing root or user failed: ' + e.message);
      process.exit(1);
    }

Note: make sure you run this code as root

## Installation

    $ npm install chroot

## API

### chroot(newroot, user, [group])
* newroot {String}  the path of the new root for this process
* user {String}  the user name or id to switch to after changing the root
* group {String}  optional group name or id, defaults to the entry in /etc/groups of `user`

## Todo
* verify changing the user id is done right using this paper: http://www.cs.berkeley.edu/~daw/papers/setuid-usenix02.pdf
* sanitize open file descriptors, waiting for https://github.com/melor/node-posix/issues/17
* create chroot.test() to help create safe chroots by checking paths, permissions, open file descriptors and environment

## License

MIT, see LICENSE

## Bugs

See <https://github.com/timkuijsten/node-chroot/issues>.
