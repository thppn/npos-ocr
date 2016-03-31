"use strict";

var debug = require('debug')('npos:tesseract');
var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');
var Jimp = require('jimp');
var proback = require('proback');
var tessocr = require('tessocr');
var tess = tessocr.tess();

module.exports = function (image, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }

  options = _.defaults(options, {
    language: 'chs.pos.fast',
    psm: 6
  });
  cb = cb || proback();

  debug(options);

  if (typeof image === 'string' || Buffer.isBuffer(image)) {
    tess.recognize(image, options, cb);
  } else {
    if (typeof image.toJimp === 'function') {
      image = image.toJimp();
    }

    image.getBuffer(Jimp.MIME_PNG, function (err, buffer) {
      if (err) return cb(err);
      tess.recognize(buffer, options, cb);
    });
  }
  return cb.promise;
};
