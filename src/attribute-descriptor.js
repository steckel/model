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

class AttributeDescriptor {
  constructor(options) {
    var DEFAULTS = this.constructor.DEFAULTS;
    this.ctor = options.ctor || DEFAULTS.ctor;
    this.repeated = options.repeated || DEFAULTS.repeated;
    this.default = options.default || DEFAULTS.default;
  }

  /**
   * @param {*} data - data to coerce into described attribute value
   * @returns value
   */
  makeValue(data) {
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
      value = data.map((datum) => _makeValue(this.ctor, datum));
    } else {
      value = _makeValue(this.ctor, data);
    }
    return value;
  }

  /**
   * Utility function for generating an AttributeDescriptor
   *
   * @param   {(function|class)} ctor   - class/constructor of attribute
   * @param   {object={}}        options - {AttributeDescriptor} options other than constructor
   * @returns {AttributeDescriptor}
   *
   *   attr(String);
   *   // { ctor: String, repeated: false, default: undefined }
   *
   *   attr(Boolean, { repeated: true });
   *   // returns { ctor: Boolean, repeated: true, default: undefined }
   *
   *   attr(Boolean, { default: true });
   *   // returns { ctor: Boolean, repeated: false, default: true }
   *
   */
  static attr(ctor, options) {
    var options = options || {},
        DEFAULTS = AttributeDescriptor.DEFAULTS,
        descriptorOptions = {ctor: ctor};

    ['repeated', 'default'].forEach((key) => {
      descriptorOptions[key] = options[key] || DEFAULTS[key]
    });

    return new AttributeDescriptor(descriptorOptions);
  }
}

Object.defineProperty(AttributeDescriptor, 'DEFAULTS', {
  value: {
    ctor: undefined,
    repeated: false,
    default: undefined
  }
});

module.exports = AttributeDescriptor;
