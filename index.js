var posix = require('posix');

/**
 * Change the root of the current process. A non-superuser must be provided since
 * changing root without dropping privileges makes no sense from a security point
 * of view.
 *
 * @param {String} newroot  the path of the new root for this process.
 * @param {String} user  the user name or id to switch to after changing the root
 * @param {String} [group]  the group name or id to switch to after changing the
 *                          root, defaults to the groups the provided user is in
 * @throws if any operation fails
 */
module.exports = function chroot(newroot, user, group) {
  if (!newroot) { throw new Error('provide newroot'); }
  if (!user) { throw new Error('provide user'); }

  if (process.getuid() !== 0 || posix.geteuid() !== 0) {
    throw new Error('chroot must be called while running as root');
  }

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

  // try to restore privileges
  try {
    posix.setreuid(-1, 0);
  } catch(e) {
    // double check real and effective ids of the user and group and supplemental groups
    var ids = [process.getuid(), process.getgid(), posix.geteuid(), posix.getegid()];
    Array.prototype.push.apply(ids, process.getgroups());

    // if none of the ids is zero, privileges are successfully dropped 
    if (!~ids.indexOf(0)) {
      // success
      return;
    }
  }

  throw new Error('unable to drop privileges');
};

/**
 * TODO: add utilities that can help a user in inspecting a designated chroot by
 * checking paths up to the original root for ownership and permissions,
 * environment and open file descriptors.
 *
 * see also:
 * http://www.unixwiz.net/techtips/chroot-practices.html
 * http://www.dwheeler.com/secure-programs/Secure-Programs-HOWTO/minimize-privileges.html
 * http://www.cs.berkeley.edu/~daw/papers/setuid-usenix02.pdf
 * http://www.lst.de/~okir/blackhats/node97.html
 */
