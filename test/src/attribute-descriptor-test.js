var expect = require('chai').expect,
    AttributeDescriptor = require('../../lib/attribute-descriptor');

describe('AttributeDescriptor', () => {

  describe('.makeValue', () => {
    var descriptor;

    describe('with arguments already instances of constructor', () => {
      describe('{ ctor: HelloWorld }', () => {
        class HelloWorld {
          constructor(worldName) {
            if (typeof worldName !== 'string') throw new Error("Bad arguments");
            this.worldName = worldName;
          }

          toString() {
            return `Hello ${this.worldName}`;
          }
        }

        before(() => {
          descriptor = new AttributeDescriptor({ ctor: HelloWorld });
        });

        it('works given constructor datum', () => {
          expect(descriptor.makeValue('Earth').toString()).to.equal("Hello Earth");
        });

        it('works given instance of HelloWorld', () => {
          var helloEarth = new HelloWorld('Earth');
          expect(descriptor.makeValue(helloEarth).toString()).to.equal("Hello Earth");
        });

      });
    });

    describe('with simple examples:', () => {
      describe('{ ctor: String }', () => {
        before(() => {
          descriptor = new AttributeDescriptor({ ctor: String });
        });

        it('makes a string', () => {
          expect(descriptor.makeValue("hello world")).to.equal("hello world");
          expect(descriptor.makeValue(false)).to.equal("false");

          expect(descriptor.makeValue()).to.equal(undefined);
          expect(descriptor.makeValue(undefined)).to.equal(undefined);
          expect(descriptor.makeValue(null)).to.equal(null);
        });
      });

      describe('{ ctor: Number }', () => {
        before(() => {
          descriptor = new AttributeDescriptor({
            ctor: Number
          });
        });

        it('makes a number', () => {
          expect(descriptor.makeValue(1)).to.equal(1);
          expect(Number.isNaN(descriptor.makeValue("one"))).to.equal(true);

          expect(descriptor.makeValue()).to.equal(undefined);
          expect(descriptor.makeValue(undefined)).to.equal(undefined);
          expect(descriptor.makeValue(null)).to.equal(null);
        });
      });

      describe('{ ctor: Boolean }', () => {
        before(() => {
          descriptor = new AttributeDescriptor({
            ctor: Boolean
          });
        });

        it('makes a boolean', () => {
          expect(descriptor.makeValue(true)).to.equal(true);
          expect(descriptor.makeValue("false")).to.equal(true);

          expect(descriptor.makeValue()).to.equal(undefined);
          expect(descriptor.makeValue(undefined)).to.equal(undefined);
          expect(descriptor.makeValue(null)).to.equal(null);
        });
      });

      describe('{ ctor: Object }', () => {
        before(() => {
          descriptor = new AttributeDescriptor({
            ctor: Object
          });
        });

        it('makes an object', () => {
          expect(descriptor.makeValue({})).to.eql({});
          expect(descriptor.makeValue({key: "value"})).to.eql({key: "value"});

          expect(descriptor.makeValue()).to.equal(undefined);
          expect(descriptor.makeValue(undefined)).to.equal(undefined);
          expect(descriptor.makeValue(null)).to.equal(null);
        });
      });
    });

    describe('with repeated values', () => {
      before(() => {
        descriptor = new AttributeDescriptor({
          ctor: String,
          repeated: true
        });
      });

      it("probably blows up if it's passed something other than an array")

      it('makes an empty array without initial values', () => {
        expect(descriptor.makeValue()).to.deep.equal([]);
        expect(descriptor.makeValue([])).to.deep.equal([]);
        expect(descriptor.makeValue(undefined)).to.deep.equal([]);
        expect(descriptor.makeValue(null)).to.deep.equal([]);
      });

      it('maps the array into an array of described values', () => {
        expect(descriptor.makeValue(["hello", "world"])).deep.equal([
          "hello",
          "world"
        ]);
      });
    });

    describe('with default values', () => {
      before(() => {
        descriptor = new AttributeDescriptor({
          ctor: String,
          default: 'this is default'
        });
      });

      it('uses default without initial value', () => {
        expect(descriptor.makeValue()).to.equal('this is default');
        expect(descriptor.makeValue(undefined)).to.equal(undefined);
        expect(descriptor.makeValue(null)).to.equal(null);
      });

      it("doesn't use defaultValue when passed initial value", () => {
        expect(descriptor.makeValue('not default')).to.equal('not default');
      });
    });
  });

  describe('#attr', () => {
    it('returns a new AttributeDescriptor', () => {
      expect(AttributeDescriptor.attr(String)).to.be.an.instanceOf(AttributeDescriptor)
    });
  });
});
