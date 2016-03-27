'use strict';

var fs = require('fs');
var ramdisk = require('../lib/ramdisk');
var assert = require('chai').assert;

describe('ramdisk', function () {
  it('should sure ramdisk', function () {
    return ramdisk('test').sure().then(function (disk) {
      assert.ok(fs.existsSync(disk.mount));
      return disk.remove().then(function () {
        assert.notOk(fs.existsSync(disk.mount));
      });
    });
  });
});
