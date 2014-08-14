const expect = require('chai').expect,
      Model = require('../../lib/model')
      Store = require('../../lib/store'),
      attr = require('../../lib/attribute-descriptor').attr,
      Promise = require('promise');

describe('Model (abstract class)', function() {
  describe('.constructor', () => {
    describe('calling without `new` keyword', () => {
      it('throws an error', () => {
        expect(() => Model()).to.throw(Error);
      });
    });

    describe('calling new on Model directly', () => {
      it('throws an error', () => {
        expect(() => new Model()).to.throw(Error);
      });
    });
  });
});

class SimpleSubClass extends Model {};

class Person extends Model {
  constructor(properties) {
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

    super(properties);
  }

  get asl() {
    return `${this.age}/${this.sex}/${this.location}`;
  }

  set asl(value) {
    var values = value.split('/');
    this.age = parseInt(values[0]);
    this.sex = values[1];
    this.location = values[2];
  }
};

var datum = {
  firstName: "Bruce",
  lastName: "Banner",
  age: 33,
  dob: "1969-12-18T08:00:00.000Z",
  location: "New Mexico",
  alive: true,
  aliases: ["Hulk", "World-Breaker"]
};

describe('Model (implmentation)', () => {
  describe('.constructor', () => {
    describe('without the `new` keyword', () => {
      it('throws an error', () => {
        expect(() => SimpleSubClass()).to.throw(/You must use the new keyword/);
      });
    });

    describe('with the `new` keyword', () => {
      it('does not throw an error', () => {
        expect(() => new SimpleSubClass).not.to.throw(/Don't call new on Model directly/);
      });
    });

    describe('without a defined schema', () => {
      it('throws an error', () => {
        expect(() => new SimpleSubClass).to.throw(/What is a model good for without a schema?/);
      });
    });

    describe('with a defined schema', () => {
      it('does not throw an error', () => {
        expect(() => new Person).not.to.throw(/What is a model good for without a schema?/);
      });
    });

    describe('without data argument', () => {
      var person;

      before(() => {
        person = new Person();
      });

      it('works' , () => {
        expect(person).to.be.an.instanceof(Person);
      });

      it('defines default values...', () => {
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

    describe('with datum argument', () => {
      var person = new Person(datum);

      it("initializes and populates the instance's values", () => {
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

  describe('getters and setters', () => {
    var person;
    before(() => person = new Person(datum));

    describe('for values within the schema', () => {
      describe('when not explicitely defined', () => {
        it('are autmatically defined', () => {
          expect(Object.keys(person)).to.contain('firstName', 'lastName', 'age', 'sex', 'location');
        });
      });

      describe('when explicitely defined', () => {
        it('are not overridden', () => {
          expect(Object.keys(person)).to.contain('firstName', 'lastName', 'age', 'sex', 'location');
        });
      });
    });

    describe('for values outside the schema', () => {
      it('work', () => {
        expect(person.asl).to.equal('33/Male/New Mexico');

        person.asl = '40/Male/S.H.I.E.L.D. Helicarrier';
        expect(person.age).to.equal(40);
        expect(person.sex).to.equal('Male');
        expect(person.location).to.equal('S.H.I.E.L.D. Helicarrier');
      });
    });
  });

  describe(".toJSON", () => {
    it("calls .toJSON() recursively; returns a simple JSON reprasentation of the model", () => {
      var expectation = JSON.parse(JSON.stringify(datum));
      expectation.id = undefined; // our json should return fields without values
      expectation.sex = 'Male'; // default
      var person = new Person(datum);
      expect(person.toJSON()).to.eql(expectation);
    })

    describe("with a repeated non-primitive", () => {
      var week;

      class Week extends Model {
        get schema() {
          return {
            days: attr(Date, {repeated: true})
          };
        };
      }

      before(() => {
        week = new Week({days: [1,2,3,4,5,6,7].map(() => new Date("1970-01-01T00:00:00.000Z"))});
      });

      it("calls toJSON on array's content", () => {
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

  describe(".findAll", () => {
    it("maps the store's .findAll result to the constructor");
  });
});
