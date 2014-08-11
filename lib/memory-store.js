var $__Object$getPrototypeOf = Object.getPrototypeOf;
var $__Object$defineProperty = Object.defineProperty;
var $__Object$create = Object.create;

var Store = require('./store'),
    Promise = require('promise');

var MemoryStore = function($__super) {
  function MemoryStore() {
    $__Object$getPrototypeOf(MemoryStore.prototype).constructor.call(this);
    this._data = {};
  }

  MemoryStore.__proto__ = ($__super !== null ? $__super : Function.prototype);
  MemoryStore.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

  $__Object$defineProperty(MemoryStore.prototype, "constructor", {
    value: MemoryStore
  });

  $__Object$defineProperty(MemoryStore.prototype, "save", {
    value: function() {
    },

    enumerable: false,
    writable: true
  });

  return MemoryStore;
}(Store);

module.exports = MemoryStore;
