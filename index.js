var fs = require('fs');
var posix = require('posix');

/**
 * Change the root of the current process. A non-root user must be provided since
 * changing root without dropping privileges makes no sense from a security point
 * of view.
 *
 * @param {String} newroot  the path of the new root for this process.
 * @param {String} user  the user name or id to switch to after changing the root
 * @param {String} [group]  the group name or id to switch to after changing the
 *                          root, default to the gid of the user
 * @throws if any operation fails
 */
module.exports = function chroot(newroot, user, group) {
  if (!newroot) { throw new Error('provide newroot'); }
  if (!user) { throw new Error('provide user'); }

  var pwd;
  try {
    pwd = posix.getpwnam(user);
  } catch(e) {
    throw new Error('user not found: ' + user);
  }

  try {
    if (typeof group === 'undefined') {
      process.initgroups(pwd.uid, pwd.gid);
    } else {
      process.setgroups([group]);
    }
  } catch(e) {
    throw new Error('changing groups failed: ' + e.message);
  }

  try {
    posix.chroot(newroot);
  } catch(e) {
    throw new Error('changing root failed: ' + e.message);
  }
  process.chdir('/');

  process.setgid(group || pwd.gid);
  process.setuid(pwd.uid);
};

/**
 * Test a new root for a new user and warn on stdout about possible risks.
 *
 * TODO: check paths up to the original root for ownership and permissions.
 *
 * also see:
 * http://www.dwheeler.com/secure-programs/Secure-Programs-HOWTO/minimize-privileges.html
 * http://www.cs.berkeley.edu/~daw/papers/setuid-usenix02.pdf
 * http://www.lst.de/~okir/blackhats/node97.html
 *
 * @param {String} newroot  the path of the new root for this process.
 * @param {String} user  the user name or id to switch to after changing the root
 * @param {String} [group]  the group name or id to switch to after changing the
 *                          root, default to the gid of the user
 * @throws if any operation fails
 */
module.exports.testroot = function testroot(newroot, user, group) {
  if (!newroot) { throw new Error('provide newroot'); }
  if (!user) { throw new Error('provide user'); }

  var pwd;
  try {
    pwd = posix.getpwnam(user);
  } catch(e) {
    throw new Error('user not found: ' + user);
  }

  // check if we are changing to a non-root user
  if (pwd.uid === 0) { console.log('warning: chroot without changing the user is unsafe'); }

  process.initgroups(pwd.uid, group || pwd.gid);

  if (!posix.chroot(newroot)) {
    throw new Error('changing root failed');
  }
  process.chdir('/');

  process.setgid(group || pwd.gid);
  process.setuid(pwd.uid);

  // check if the new root is writable by the new user
  var testFile = '/mqtpb6N5vTLhvjggCn0Gb8LvsKXNzVuM6L2j8m4OJphjq6uVRjrVULvsFyPpJPTE';
  try {
    fs.openSync(testFile, 'w');
    console.log('warning: the new root is writable by the new user, consider using a writable subdir only');
    fs.unlinkSync(testFile);
  } catch(e) {
    console.log('very well the new root is not writable by the new user', JSON.stringify(e));
  }
};
