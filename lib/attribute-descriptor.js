/**
 * @typedef  AttributeDescriptor
 * @type     {object}
 * @property {function} ctor     - Attribute's constructor function/class
 * @property {boolean}  repeated - Attribute is an array of constructor's instance
 * @property {*}        default  - Attribute's default value
 *
 *   {
 *     ctor: String,
 *     repeated: false,
 *     default: "default string value"
 *   }
 *
 */

var $__Object$defineProperty = Object.defineProperty;

var AttributeDescriptor = function() {
  function AttributeDescriptor(options) {
    var DEFAULTS = this.constructor.DEFAULTS;
    this.ctor = options.ctor || DEFAULTS.ctor;
    this.repeated = options.repeated || DEFAULTS.repeated;
    this.default = options.default || DEFAULTS.default;
  }

  $__Object$defineProperty(AttributeDescriptor.prototype, "makeValue", {
    value: function(data) {
      data = arguments.length > 0 ? data : this.default;

      function _makeValue(ctor, data) {
        var instance;

        if (data === null || typeof data === 'undefined' || data instanceof ctor) {
          instance = data;
        } else if (ctor === Boolean || ctor === Number || ctor === String) {
          instance = arguments.length > 1 ? ctor(data) : ctor();
        } else if (typeof ctor === "function") {
          instance = arguments.length > 1 ? new ctor(data) : new ctor();
        }

        return instance;
      }

      var value;
      if (this.repeated) {
        data = data || [];
        value = data.map(function(datum) {
          return _makeValue(this.ctor, datum);
        }.bind(this));
      } else {
        value = _makeValue(this.ctor, data);
      }
      return value;
    },

    enumerable: false,
    writable: true
  });

  $__Object$defineProperty(AttributeDescriptor, "attr", {
    value: function(ctor, options) {
      var options = options || {},
          DEFAULTS = AttributeDescriptor.DEFAULTS,
          descriptorOptions = {ctor: ctor};

      ['repeated', 'default'].forEach(function(key) {
        descriptorOptions[key] = options[key] || DEFAULTS[key]
      });

      return new AttributeDescriptor(descriptorOptions);
    },

    enumerable: false,
    writable: true
  });

  return AttributeDescriptor;
}();

Object.defineProperty(AttributeDescriptor, 'DEFAULTS', {
  value: {
    ctor: undefined,
    repeated: false,
    default: undefined
  }
});

module.exports = AttributeDescriptor;
