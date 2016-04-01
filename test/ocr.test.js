'use strict';

var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var Jimp = require('jimp');
var npos = require('npos');
var raster = npos.codecs.raster;

var ocr = require('..').ocr;

var imageFile = path.join(__dirname, 'fixtures', 'receipt.png');
var rasterFile = path.join(__dirname, 'fixtures', 'raster.bin');

describe('ocr', function () {
  this.timeout(5000);

  it('should ocr using local image file path', function () {
    return ocr(imageFile, {
      tessdata: path.join(__dirname, 'fixtures', 'tessdata'),
      language: 'pos.chs.fast'
    }).then(function (text) {
      assert.ok(text);
      assert.include(text, '单号');
    });
  });

  it('should ocr using png image', function (done) {
    Jimp.read(imageFile, function (err, image) {
      ocr(image, {
        tessdata: path.join(__dirname, 'fixtures', 'tessdata'),
        language: 'pos.chs.fast'
      }).then(function (text) {
        assert.ok(text);
        assert.include(text, '单号');
      }).asCallback(done);
    });
  });

  it('should ocr with npos BitImage', function () {
    var image = npos.bitimage();
    var i = fs.readFileSync(rasterFile);
    for (i = raster.decode(i); i; i = raster.decode(i)) {
      image.append(i);
    }
    return ocr(image, {
      tessdata: path.join(__dirname, 'fixtures', 'tessdata'),
      language: 'pos.chs.fast'
    }).then(function (text) {
      assert.ok(text);
      assert.include(text, '现金'); // pos.chs.fast is not compatible with raster.bin well, so pick `现金` as expected
    });
  });
});
