var $__Object$defineProperty = Object.defineProperty;
var $__Object$create = Object.create;
var $__Object$getPrototypeOf = Object.getPrototypeOf;

const expect = require('chai').expect,
      Model = require('../../lib/model');

Store = require('../../lib/store'),
attr = require('../../lib/attribute-descriptor').attr,
Promise = require('promise');

describe('Model (abstract class)', function() {
  describe('.constructor', function() {
    describe('calling without `new` keyword', function() {
      it('throws an error', function() {
        expect(function() {
          return Model();
        }).to.throw(Error);
      });
    });

    describe('calling new on Model directly', function() {
      it('throws an error', function() {
        expect(function() {
          return new Model();
        }).to.throw(Error);
      });
    });
  });
});

var SimpleSubClass = function($__super) {
  function SimpleSubClass() {
    var $__0 = $__Object$getPrototypeOf(SimpleSubClass.prototype);

    if ($__0 !== null)
      $__0.constructor.apply(this, arguments);
  }

  SimpleSubClass.__proto__ = ($__super !== null ? $__super : Function.prototype);
  SimpleSubClass.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

  $__Object$defineProperty(SimpleSubClass.prototype, "constructor", {
    value: SimpleSubClass
  });

  return SimpleSubClass;
}(Model);

var Person = function($__super) {
  function Person(properties) {
    this.schema = {
      id: attr(Number),
      firstName: attr(String),
      lastName: attr(String),
      age: attr(Number),
      dob: attr(Date),
      sex: attr(String, {default: 'Male'}),
      location: attr(String),
      alive: attr(Boolean),
      aliases: attr(String, {repeated:true}),
    };

    $__Object$getPrototypeOf(Person.prototype).constructor.call(this, properties);
  }

  Person.__proto__ = ($__super !== null ? $__super : Function.prototype);
  Person.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

  $__Object$defineProperty(Person.prototype, "constructor", {
    value: Person
  });

  $__Object$defineProperty(Person.prototype, "asl", {
    get: function() {
      return "" + this.age + "/" + this.sex + "/" + this.location + "";
    },

    set: function(value) {
      var values = value.split('/');
      this.age = parseInt(values[0]);
      this.sex = values[1];
      this.location = values[2];
    },

    enumerable: false
  });

  return Person;
}(Model);

var datum = {
  firstName: "Bruce",
  lastName: "Banner",
  age: 33,
  dob: "1969-12-18T08:00:00.000Z",
  location: "New Mexico",
  alive: true,
  aliases: ["Hulk", "World-Breaker"]
};

describe('Model (implmentation)', function() {
  describe('.constructor', function() {
    describe('without the `new` keyword', function() {
      it('throws an error', function() {
        expect(function() {
          return SimpleSubClass();
        }).to.throw(/You must use the new keyword/);
      });
    });

    describe('with the `new` keyword', function() {
      it('does not throw an error', function() {
        expect(function() {
          return new SimpleSubClass;
        }).not.to.throw(/Don't call new on Model directly/);
      });
    });

    describe('without a defined schema', function() {
      it('throws an error', function() {
        expect(function() {
          return new SimpleSubClass;
        }).to.throw(/What is a model good for without a schema?/);
      });
    });

    describe('with a defined schema', function() {
      it('does not throw an error', function() {
        expect(function() {
          return new Person;
        }).not.to.throw(/What is a model good for without a schema?/);
      });
    });

    describe('without data argument', function() {
      var person;

      before(function() {
        person = new Person();
      });

      it('works' , function() {
        expect(person).to.be.an.instanceof(Person);
      });

      it('defines default values...', function() {
        expect(person.id).to.equal(undefined);
        expect(person.firstName).to.equal(undefined);
        expect(person.lastName).to.equal(undefined);
        expect(person.age).to.equal(undefined);
        expect(person.dob).to.equal(undefined);
        expect(person.sex).to.equal('Male');
        expect(person.location).to.equal(undefined);
        expect(person.alive).to.equal(undefined);
        expect(person.aliases).to.deep.equal([]);
      });
    });

    describe('with datum argument', function() {
      var person = new Person(datum);

      it("initializes and populates the instance's values", function() {
        expect(person.id).to.equal(undefined);

        expect(person.firstName).to.equal(datum.firstName);
        expect(person.firstName.constructor).to.equal(String);

        expect(person.dob.toISOString()).to.equal(new Date(datum.dob).toISOString());
        expect(person.dob.constructor).to.equal(Date);

        expect(person.alive).to.equal(datum.alive);
        expect(person.alive.constructor).to.equal(Boolean);

        expect(person.aliases).to.deep.equal(datum.aliases);
        expect(person.aliases.constructor).to.equal(Array);
        expect(person.aliases[0].constructor).to.equal(String);
      });
    });
  });

  describe('getters and setters', function() {
    var person;
    before(function() {
      return person = new Person(datum);
    });

    describe('for values within the schema', function() {
      describe('when not explicitely defined', function() {
        it('are autmatically defined', function() {
          expect(Object.keys(person)).to.contain('firstName', 'lastName', 'age', 'sex', 'location');
        });
      });

      describe('when explicitely defined', function() {
        it('are not overridden', function() {
          expect(Object.keys(person)).to.contain('firstName', 'lastName', 'age', 'sex', 'location');
        });
      });
    });

    describe('for values outside the schema', function() {
      it('work', function() {
        expect(person.asl).to.equal('33/Male/New Mexico');

        person.asl = '40/Male/S.H.I.E.L.D. Helicarrier';
        expect(person.age).to.equal(40);
        expect(person.sex).to.equal('Male');
        expect(person.location).to.equal('S.H.I.E.L.D. Helicarrier');
      });
    });
  });

  describe(".toJSON", function() {
    it("calls .toJSON() recursively; returns a simple JSON reprasentation of the model", function() {
      var expectation = JSON.parse(JSON.stringify(datum));
      expectation.id = undefined; // our json should return fields without values
      expectation.sex = 'Male'; // default
      var person = new Person(datum);
      expect(person.toJSON()).to.eql(expectation);
    })

    describe("with a repeated non-primitive", function() {
      var week;

      var Week = function($__super) {
        function Week() {
          var $__1 = $__Object$getPrototypeOf(Week.prototype);

          if ($__1 !== null)
            $__1.constructor.apply(this, arguments);
        }

        Week.__proto__ = ($__super !== null ? $__super : Function.prototype);
        Week.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

        $__Object$defineProperty(Week.prototype, "constructor", {
          value: Week
        });

        $__Object$defineProperty(Week.prototype, "schema", {
          get: function() {
            return {
              days: attr(Date, {repeated: true})
            };
          },

          enumerable: false
        });

        return Week;
      }(Model);

      before(function() {
        week = new Week({days: [1,2,3,4,5,6,7].map(function() {
          return new Date("1970-01-01T00:00:00.000Z");
        })});
      });

      it("calls toJSON on array's content", function() {
        expect(week.toJSON()).to.deep.equal({
          days: [
            "1970-01-01T00:00:00.000Z",
            "1970-01-01T00:00:00.000Z",
            "1970-01-01T00:00:00.000Z",
            "1970-01-01T00:00:00.000Z",
            "1970-01-01T00:00:00.000Z",
            "1970-01-01T00:00:00.000Z",
            "1970-01-01T00:00:00.000Z"
            ]
        });
      });
    });
  });

  describe(".findAll", function() {
    it("maps the store's .findAll result to the constructor");
  });
});
