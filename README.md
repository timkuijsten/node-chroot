# chroot

Chroot the current process and drop privileges.

## Example

Bind a TCP server to a privileged port before dropping privileges.

    var net = require('net');
    var chroot = require('chroot');

    var server = net.createServer();
    server.listen(81, function(err) {
      if (err) { throw err; }

      try {
        chroot('/var/empty', 'nobody');
        process.stdout.write('changed root to "/var/empty" and user to "nobody"\n');
      } catch(e) {
        process.stderr.write('changing root or user failed: ' + JSON.stringify(e) + '\n');
        process.exit(1);
      }
    });

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
