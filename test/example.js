var net = require('net');
var chroot = require('../index');

var server = net.createServer();
server.listen(81, function(err) {
  if (err) { throw err; }

  try {
    chroot('/var/empty', 'nobody');
    console.log('changed root to "/var/empty" and user to "nobody"');
  } catch(err) {
    console.error('changing root or user failed', err);
    process.exit(1);
  }
});
