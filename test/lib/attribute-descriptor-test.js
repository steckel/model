var $__Object$defineProperty = Object.defineProperty;

var expect = require('chai').expect,
    AttributeDescriptor = require('../../lib/attribute-descriptor');

describe('AttributeDescriptor', function() {

  describe('.makeValue', function() {
    var descriptor;

    describe('with arguments already instances of constructor', function() {
      describe('{ ctor: HelloWorld }', function() {
        var HelloWorld = function() {
          function HelloWorld(worldName) {
            if (typeof worldName !== 'string') throw new Error("Bad arguments");
            this.worldName = worldName;
          }

          $__Object$defineProperty(HelloWorld.prototype, "toString", {
            value: function() {
              return "Hello " + this.worldName + "";
            },

            enumerable: false,
            writable: true
          });

          return HelloWorld;
        }();

        before(function() {
          descriptor = new AttributeDescriptor({ ctor: HelloWorld });
        });

        it('works given constructor datum', function() {
          expect(descriptor.makeValue('Earth').toString()).to.equal("Hello Earth");
        });

        it('works given instance of HelloWorld', function() {
          var helloEarth = new HelloWorld('Earth');
          expect(descriptor.makeValue(helloEarth).toString()).to.equal("Hello Earth");
        });
      });
    });

    describe('with simple examples:', function() {
      describe('{ ctor: String }', function() {
        before(function() {
          descriptor = new AttributeDescriptor({ ctor: String });
        });

        it('makes a string', function() {
          expect(descriptor.makeValue("hello world")).to.equal("hello world");
          expect(descriptor.makeValue(false)).to.equal("false");

          expect(descriptor.makeValue()).to.equal(undefined);
          expect(descriptor.makeValue(undefined)).to.equal(undefined);
          expect(descriptor.makeValue(null)).to.equal(null);
        });
      });

      describe('{ ctor: Number }', function() {
        before(function() {
          descriptor = new AttributeDescriptor({
            ctor: Number
          });
        });

        it('makes a number', function() {
          expect(descriptor.makeValue(1)).to.equal(1);
          expect(Number.isNaN(descriptor.makeValue("one"))).to.equal(true);

          expect(descriptor.makeValue()).to.equal(undefined);
          expect(descriptor.makeValue(undefined)).to.equal(undefined);
          expect(descriptor.makeValue(null)).to.equal(null);
        });
      });

      describe('{ ctor: Boolean }', function() {
        before(function() {
          descriptor = new AttributeDescriptor({
            ctor: Boolean
          });
        });

        it('makes a boolean', function() {
          expect(descriptor.makeValue(true)).to.equal(true);
          expect(descriptor.makeValue("false")).to.equal(true);

          expect(descriptor.makeValue()).to.equal(undefined);
          expect(descriptor.makeValue(undefined)).to.equal(undefined);
          expect(descriptor.makeValue(null)).to.equal(null);
        });
      });

      describe('{ ctor: Object }', function() {
        before(function() {
          descriptor = new AttributeDescriptor({
            ctor: Object
          });
        });

        it('makes an object', function() {
          expect(descriptor.makeValue({})).to.eql({});
          expect(descriptor.makeValue({key: "value"})).to.eql({key: "value"});

          expect(descriptor.makeValue()).to.equal(undefined);
          expect(descriptor.makeValue(undefined)).to.equal(undefined);
          expect(descriptor.makeValue(null)).to.equal(null);
        });
      });
    });

    describe('with repeated values', function() {
      before(function() {
        descriptor = new AttributeDescriptor({
          ctor: String,
          repeated: true
        });
      });

      it("probably blows up if it's passed something other than an array")

      it('makes an empty array without initial values', function() {
        expect(descriptor.makeValue()).to.deep.equal([]);
        expect(descriptor.makeValue([])).to.deep.equal([]);
        expect(descriptor.makeValue(undefined)).to.deep.equal([]);
        expect(descriptor.makeValue(null)).to.deep.equal([]);
      });

      it('maps the array into an array of described values', function() {
        expect(descriptor.makeValue(["hello", "world"])).deep.equal([
          "hello",
          "world"
        ]);
      });
    });

    describe('with default values', function() {
      before(function() {
        descriptor = new AttributeDescriptor({
          ctor: String,
          default: 'this is default'
        });
      });

      it('uses default without initial value', function() {
        expect(descriptor.makeValue()).to.equal('this is default');
        expect(descriptor.makeValue(undefined)).to.equal(undefined);
        expect(descriptor.makeValue(null)).to.equal(null);
      });

      it("doesn't use defaultValue when passed initial value", function() {
        expect(descriptor.makeValue('not default')).to.equal('not default');
      });
    });
  });

  describe('#attr', function() {
    it('returns a new AttributeDescriptor', function() {
      expect(AttributeDescriptor.attr(String)).to.be.an.instanceOf(AttributeDescriptor)
    });
  });
});
