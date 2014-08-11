var NotImplementedError = require('./not-implemented-error'),
    enforceSubClassing = require('./utils').enforceSubClassing,
    enforceNewKeyword = require('./utils').enforceNewKeyword;

class Store {
  constructor() {
    enforceSubClassing(this.constructor, Store);
    enforceNewKeyword(this, Store);
  }

  destroy() {
    throw new NotImplementedError('destroy not implemented');
  }

  /**
   * Persists given model data
   * @param {obj} data - serialized data off a model instance
   * @returns {promise}
   */
  save(data) {
    throw new NotImplementedError('save not implemented');
  }

  /**
   * Returns all records matching the query
   * @param {*} query - find parameters
   * @returns {promise => array}
   */
  find(query) {
    throw new NotImplementedError('find not implemented');
  }

  /**
   * Returns all available records
   * @returns {promise => array}
   */
  findAll() {
    throw new NotImplementedError('findAll not implemented');
  }

  /**
   * simple proxy to this.constructor.serialize
   */
  serialize(instance) {
    return this.constructor.serialize(instance);
  }

  /**
   * @param data - data in need of transformation off the wire
   * @returns data - data ready to be used for the model constructor
   */
  static serialize(instance) {
    return instance.toJSON(); // FIXME: probably a bad idea
  }

  /**
   * simple proxy to this.constructor.deserialize
   */
  deserialize(data) {
    return this.constructor.deserialize(data);
  }

  /**
   * @param data - data in need of transformation off the wire
   * @returns data - data ready to be used for the model constructor
   */
  static deserialize(data) {
    return data;
  }
}

module.exports = Store;
