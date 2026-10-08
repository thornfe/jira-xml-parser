const { Writable } = require('stream');
const { StringDecoder } = require('string_decoder');
const SAXParser = require('./sax-parser');
const { SAX_EVENTS } = require('./constants');

class SAXStream extends Writable {
  constructor() {
    super();
    this._parser = new SAXParser();
    this._decoder = new StringDecoder('utf8');
    // Throw into _write/_final so parsing stops at the first error.
    this._parser.onerror = error => { throw error; };
    for (const event of SAX_EVENTS) {
      if (event !== 'error' && event !== 'end') {
        this._parser['on' + event] = (...args) => this.emit(event, ...args);
      }
    }
  }

  _write(chunk, encoding, callback) {
    try {
      this._parser.write(this._decoder.write(chunk));
    } catch (error) {
      callback(error);
      return;
    }
    callback();
  }

  _final(callback) {
    try {
      const remaining = this._decoder.end();
      if (remaining) this._parser.write(remaining);
      this._parser.end();
    } catch (error) {
      callback(error);
      return;
    }
    callback();
  }
}

module.exports = { SAXStream };
