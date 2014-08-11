var Store = require('./store'),
    Promise = require('promise');

class MemoryStore extends Store {
  constructor() {
    super();
    this._data = {};
  }

  save() {
  }
}

module.exports = MemoryStore;
