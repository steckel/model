/* jshint esnext: true, strict: true */

var Struct = require('struct'),
    enforceNewKeyword = require('./utils').enforceNewKeyword,
    enforceSubClassing = require('./utils').enforceSubClassing;

/* @class Model
 */
class Model {
  /*
   * @param data - JavaScript data to wrap
   */
  constructor(data) {

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

  /**
   * Set multiple properties with given object
   *
   * @todo consolidate with constructor's use of AttributeDescriptor#makeValue
   *
   * @param {obj} data - object with key,val pairs of properties to set
   * @returns {undefined}
   */
  setProperties(data) {
    for (key in data) {
      this._record[key] = data[key];
    }
  }


  toJSON() {
    var json = {};

    Object.keys(this.schema).forEach((key) => {
      var attribute = this[key];
      if (typeof attribute !== 'undefined' && typeof attribute.toJSON === 'function') {
        json[key] = attribute.toJSON();
      } else {
        json[key] = attribute;
      }
    });

    return json;
  }

  /**
   * Destroy the instance (and its persisted record)
   *
   * @returns {promise => undefined}
   */
  destroy() {
    var store = this.constructor.store;
    return store.destroy(store.serialize(this))
  }

  /**
    * Save the instance to the store
    *
    * @returns {this} - returns the instance of the model after being
    *                   re-populated with saved data.
    */
  save() {
    var store = this.constructor.store;
    return store.save(store.serialize(this))
    .then((data) => {
      this.setProperties(store.deserialize(data))
      return this;
    });
  }

  static find(query) {
    var Ctor = this,
        store = this.store;
    return store.find(query)
      .then((datum) => new Ctor(store.deserialize(datum)));
  }

  // FIXME: Handle a lack of a store
  static findAll(query) {
    var Ctor = this,
        store = this.store;

    return store.findAll(query).then((data) => {
      return data.map((datum) => new Ctor(store.deserialize(datum)));
    });
  }

}

module.exports = Model;
