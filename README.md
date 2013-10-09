# chroot

Chroot the current process and drop privileges.

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
      } catch(e) {
        console.error('changing root or user failed', e);
        process.exit(1);
      }
    });

Note: since all ports below 1024 are privileged, you have to run this code as user `root`
otherwise you get error EACCES.

## Installation

    $ npm install chroot

## API

### chroot(newroot, user, [group])
* newroot {String}  the path of the new root for this process
* user {String}  the user name or id to switch to after changing the root
* group {String}  optional group name or id, defaults to the entry in /etc/groups of `user`

## Notes
* environment variables and open file descriptors are not cleared

## License

MIT, see LICENSE
