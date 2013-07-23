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

## Installation

    $ npm install chroot

## API

### chroot(newroot, user, [group])
* newroot {String}  the path of the new root for this process
* user {String}  the user name or id to switch to after changing the root
* group {String}  optional group name or id, defaults to the entry in /etc/groups of `user`

## Notes
* environment variables and any open file descriptors are not touched

## License

MIT, see LICENSE

## Bugs

See <https://github.com/timkuijsten/node-chroot/issues>.
