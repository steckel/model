var $__Object$defineProperty = Object.defineProperty;

var NotImplementedError = require('./not-implemented-error'),
    enforceSubClassing = require('./utils').enforceSubClassing,
    enforceNewKeyword = require('./utils').enforceNewKeyword;

var Store = function() {
  function Store() {
    enforceSubClassing(this.constructor, Store);
    enforceNewKeyword(this, Store);
  }

  $__Object$defineProperty(Store.prototype, "destroy", {
    value: function() {
      throw new NotImplementedError('destroy not implemented');
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Store.prototype, "save", {
    value: function(data) {
      throw new NotImplementedError('save not implemented');
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Store.prototype, "find", {
    value: function(query) {
      throw new NotImplementedError('find not implemented');
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Store.prototype, "findAll", {
    value: function() {
      throw new NotImplementedError('findAll not implemented');
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Store.prototype, "serialize", {
    value: function(instance) {
      return this.constructor.serialize(instance);
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Store.prototype, "deserialize", {
    value: function(data) {
      return this.constructor.deserialize(data);
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Store, "serialize", {
    value: function(instance) {
      return instance.toJSON(); // FIXME: probably a bad idea
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Store, "deserialize", {
    value: function(data) {
      return data;
    },

    enumerable: false,
    writable: true
  });

  return Store;
}();

module.exports = Store;
