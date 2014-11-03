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
      } catch(err) {
        console.error('changing root or user failed', err);
        process.exit(1);
      }
    });

Note: in order to change user the process must be started as a super-user.

## Installation

    $ npm install chroot

## API

### chroot(newroot, user, [group])
* newroot {String}  the path of the new root for this process
* user {String|Number}  the user name or id to switch to after changing the root
                        path
* group {String|Number}  the group name or id to switch to after changing the
                         root, defaults to the groups the user is in

Change the root of the current process. A non-superuser must be provided since
changing root without dropping privileges makes no sense from a security point
of view.

## Notes
* open file descriptors are not closed and environment variables are not cleared
  (except for PWD)
* If using `fork` beware that Node < 0.11 does not close file descriptors in the
  child. See https://github.com/joyent/node/issues/6905 and
  https://medium.com/@fun_cuddles/opening-files-in-node-js-considered-harmful-d7de566d499f

## Todo
* check `newroot` for ownership and access rights up to the original root
* examine other environmental leaks like argv and open file descriptors
* consider the implicit use of child_process

## License

MIT

Copyright (c) 2014 Tim Kuijsten

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
