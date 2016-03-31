"use strict";

var _ = require('lodash');
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

  if (typeof image === 'string' || Buffer.isBuffer(image)) {
    tess.recognize(image, options, cb);
  } else {
    if (typeof image.toJimp === 'function') {
      image = image.toJimp();
    }

    image.getBuffer('image/png', function (err, buffer) {
      if (err) return cb(err);
      tess.recognize(buffer, options, cb);
    });
  }
  return cb.promise;
};
