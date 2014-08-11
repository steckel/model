const expect = require('chai').expect,
      Model = require('../../lib/model'),
      Store = require('../../lib/store');

describe('Store (abstract class)', function() {
  describe('.constructor', () => {
    describe('calling without `new` keyword', () => {
      it('throws an error', () => {
        expect(() => Store()).to.throw(Error);
      });
    });

    describe('calling new on Store directly', () => {
      it('throws an error', () => {
        expect(() => new Store()).to.throw(Error);
      });
    });
  });
});


describe('Store (not implemented)', () => {
  class LazyStore extends Store {};
  var store = new LazyStore();

  it('throws errors on method calls');
});

describe('Store (implementation)', () => {
  class MemoryStore extends Store {
    constructor() {
      super();
      this._data = {};
    }

    save(data) {
      var key = data.id;
      this._data[key] = data;
      return new Promise((resolve, reject) => {
        resolve(this._data[key]);
      });
    }
  };

  var store;

  before(() => {
    store = new MemoryStore;
  });

  describe('.constructor', () => {
    describe('without the `new` keyword', () => {
      it('throws an error', () => {
        expect(() => MemoryStore()).to.throw(/You must use the new keyword/);
      });
    });

    describe('with the `new` keyword', () => {
      it('does not throw an error', () => {
        expect(() => new MemoryStore).not.to.throw(/Don't call new on Model directly/);
      });
    });
  });

  describe('.save', () => {
    it("commits given data to the store's persistence layer", () => {
      store.save({id:0});
      expect(store._data['0']).to.eql({id:0});
    });

    it("returns a promise resolving with persisted data", () => {
      expect(store.save({id:0, name: 'zero'})).to.eventually.eql({id:0, name: 'zero'});
    });
  });

  describe('.destroy', () => {
    it("destroys the given data data in the store's persistence layer");
  });

  describe('.find', () => {
    it("finds data from the store's persistence layer given query data");
  });

  describe('.findAll', () => {
    it("finds all the data from the store's persistence layer");
  });

  describe('.serialize', () => {
    it("transforms the given data for use with the store's persistence layer");
  });

  describe('.deserialize', () => {
    class MailingAddress extends Model {
      get schema() {
        return {
          name: attr(String),
          apartment: attr(Number),
          house: attr(Number),
          street: attr(String),
          city: attr(String),
          state: attr(String),
          zip: attr(Number)
        }
      }
    }

    class Person extends Model {
      get schema() {
        return {
          name: attr(String),
          address: attr(MailingAddress)
        }
      }
    }

    Person.store = new class extends Store {
      findAll() {
        return new Promise(function(resolve, reject) {
          resolve([{
            firstName: "Curtis",
            lastName: "Steckel",
            address: {
              lineOne: "#1 825 Masonic Ave.",
              lineTwo: "San Francisco, CA 94117"
            }
          }]);
        })
      }

      static deserialize(data) {
        data.name = `${data.firstName} ${data.lastName}`;
        return data;
      }
    };

    it("transforms data from the store for use with your constructor", () => {
      return Person.findAll().then((people) => {
        var person = people[0];
        expect(person.name).to.equal("Curtis Steckel");
      });
    });
  });


});
