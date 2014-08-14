/* jshint esnext: true, strict: true */

var $__Object$defineProperty = Object.defineProperty;

var Struct = require('struct'),
    enforceNewKeyword = require('./utils').enforceNewKeyword,
    enforceSubClassing = require('./utils').enforceSubClassing;

var Model = function() {
  function Model(data) {

    enforceSubClassing(this.constructor, Model);
    enforceNewKeyword(this, Model);

    var schema = this.schema,
        self = this,
        data = data || {};

    // Enforce a schema be defined
    if (typeof schema === 'undefined' || schema === null) {
      throw new Error("What is a model good for without a schema?");
    }

    var _record = {};

    for (var key in schema) {
      var descriptor = schema[key];
      _record[key] = data.hasOwnProperty(key)
        ? descriptor.makeValue(data[key])
        : descriptor.makeValue();
    }

    // Assign and hide internal _record
    Object.defineProperty(this, '_record', {
      value: new Struct(_record),
      enumerable: false,
      configurable: false
    });

    // Define Getters/Setters
    for (var key in schema) {
      (function(key) {
        if (typeof self[key] === 'undefined') {
          Object.defineProperty(self, key, {
            get: function() {
              return self._record[key];
            },
            set: function(value) {
              return self._record[key] = value;
            },
            enumerable: true,
            configurable: false
          });
        }
      })(key);
    }
  }

  $__Object$defineProperty(Model.prototype, "setProperties", {
    value: function(data) {
      for (key in data) {
        this._record[key] = data[key];
      }
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Model.prototype, "toJSON", {
    value: function() {
      var json = {};

      Object.keys(this.schema).forEach(function(key) {
        var attribute = this[key];
        if (typeof attribute !== 'undefined' && typeof attribute.toJSON === 'function') {
          json[key] = attribute.toJSON();
        } else {
          json[key] = attribute;
        }
      }.bind(this));

      return json;
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Model.prototype, "destroy", {
    value: function() {
      var store = this.constructor.store;
      return store.destroy(store.serialize(this))
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Model.prototype, "save", {
    value: function() {
      var store = this.constructor.store;
      return store.save(store.serialize(this))
      .then(function(data) {
        this.setProperties(store.deserialize(data))
        return this;
      }.bind(this));
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Model, "find", {
    value: function(query) {
      var Ctor = this,
          store = this.store;
      return store.find(query)
        .then(function(datum) {
        return new Ctor(store.deserialize(datum));
      });
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(Model, "findAll", {
    value: function(query) {
      var Ctor = this,
          store = this.store;

      return store.findAll(query).then(function(data) {
        return data.map(function(datum) {
          return new Ctor(store.deserialize(datum));
        });
      });
    },

    enumerable: false,
    writable: true
  });

  return Model;
}();

module.exports = Model;
