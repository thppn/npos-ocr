"use strict";

var debug = require('debug')('npos:tesseract');
var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');
var Promise = require('bluebird');
var proback = require('proback');
var tesseract = require('ntesseract');
var ramdisk = require('./ramdisk');

var remove = Promise.promisify(fs.remove);

var rd = ramdisk('tessdisk');

module.exports = function (image, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }

  options = _.defaults(options, {
    output: rd.mount,
    l: 'chs.pos.fast',
    psm: 6
  });
  cb = cb || proback();

  debug(options);

  var file;

  function ramimage(image) {
    return new Promise(function (resolve, reject) {
      if (typeof image === 'string') {
        resolve(path.resolve(image));
      } else {
        file = path.resolve(rd.mount, uuid() + '.png');
        if (typeof image.toJimp === 'function') {
          image = image.toJimp();
        }

        image.write(file, function (err) {
          if (err) {
            return reject(err);
          }
          resolve(file);
        });
      }
    });
  }

  function ocr(file) {
    return new Promise(function (resolve, reject) {
      tesseract.process(file, options, function (err, text) {
        if (err) {
          return reject(err);
        }
        resolve(text);
      });
    });
  }

  rd.sure().then(function () {
    return ramimage(image);
  }).then(ocr).asCallback(cb).finally(function () {
    if (file) {
      return remove(file);
    }
  });

  return cb.promise;
};

function uuid() {
  return (~~(Math.random() * 1e9)).toString(36);
}

