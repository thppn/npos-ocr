"use strict";

var fs = require('fs');
var path = require('path');
var ramdisk = require('node-ramdisk');
var proback = require('proback');

var DEFAULT_SIZE = 100; // 10M

module.exports = function (volume) {
  var disk = ramdisk(volume);

  disk.mount = path.join('/', 'tmp', volume);

  disk.sure = function sure(size, cb) {
    cb = cb || proback();
    if (fs.existsSync(disk.mount)) {
      cb(null, disk);
    } else {
      disk.create(size || DEFAULT_SIZE, function (err) {
        cb(err, disk);
      });
    }
    return cb.promise;
  };

  disk.remove = function remove(cb) {
    cb = cb || proback();
    if (fs.existsSync(disk.mount)) {
      disk.delete(disk.mount, cb);
    } else {
      cb();
    }
    return cb.promise;
  };

  return disk;
};
