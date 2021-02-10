"use strict";

var _ = require('lodash');
var proback = require('proback');
var tessocr = require('tessocr');
var tess = tessocr.tess();
var isValid = require('is-valid-path');

module.exports = function (image, options, cb) {

  if(!isValid(image)) {
    return;
  }

  if (typeof options === 'function') {
    cb = options;
    options = null;
  }

  options = _.defaults(options, {
    psm: 6,
    segline: true
  });
  cb = cb || proback();

  if (typeof image === 'string' || Buffer.isBuffer(image)) {
    tess.ocr(image, options, cb);
  } else {
    if (typeof image.toJimp === 'function') {
      image = image.toJimp();
    }

    image.getBuffer('image/png', function (err, buffer) {
      if (err) return cb(err);
      tess.ocr(buffer, options, cb);
    });
  }
  return cb.promise;
};
