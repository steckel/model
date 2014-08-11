var $__Object$defineProperty = Object.defineProperty;
var $__Object$create = Object.create;
var $__Object$getPrototypeOf = Object.getPrototypeOf;

const expect = require('chai').expect,
      Model = require('../../lib/model'),
      Store = require('../../lib/store');

describe('Store (abstract class)', function() {
  describe('.constructor', function() {
    describe('calling without `new` keyword', function() {
      it('throws an error', function() {
        expect(function() {
          return Store();
        }).to.throw(Error);
      });
    });

    describe('calling new on Store directly', function() {
      it('throws an error', function() {
        expect(function() {
          return new Store();
        }).to.throw(Error);
      });
    });
  });
});

describe('Store (not implemented)', function() {
  var LazyStore = function($__super) {
    function LazyStore() {
      var $__0 = $__Object$getPrototypeOf(LazyStore.prototype);

      if ($__0 !== null)
        $__0.constructor.apply(this, arguments);
    }

    LazyStore.__proto__ = ($__super !== null ? $__super : Function.prototype);
    LazyStore.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

    $__Object$defineProperty(LazyStore.prototype, "constructor", {
      value: LazyStore
    });

    return LazyStore;
  }(Store);

  var store = new LazyStore();
  it('throws errors on method calls');
});

describe('Store (implementation)', function() {
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
      value: function(data) {
        var key = data.id;
        this._data[key] = data;
        return new Promise(function(resolve, reject) {
          resolve(this._data[key]);
        }.bind(this));
      },

      enumerable: false,
      writable: true
    });

    return MemoryStore;
  }(Store);

  var store;

  before(function() {
    store = new MemoryStore;
  });

  describe('.constructor', function() {
    describe('without the `new` keyword', function() {
      it('throws an error', function() {
        expect(function() {
          return MemoryStore();
        }).to.throw(/You must use the new keyword/);
      });
    });

    describe('with the `new` keyword', function() {
      it('does not throw an error', function() {
        expect(function() {
          return new MemoryStore;
        }).not.to.throw(/Don't call new on Model directly/);
      });
    });
  });

  describe('.save', function() {
    it("commits given data to the store's persistence layer", function() {
      store.save({id:0});
      expect(store._data['0']).to.eql({id:0});
    });

    it("returns a promise resolving with persisted data", function() {
      expect(store.save({id:0, name: 'zero'})).to.eventually.eql({id:0, name: 'zero'});
    });
  });

  describe('.destroy', function() {
    it("destroys the given data data in the store's persistence layer");
  });

  describe('.find', function() {
    it("finds data from the store's persistence layer given query data");
  });

  describe('.findAll', function() {
    it("finds all the data from the store's persistence layer");
  });

  describe('.serialize', function() {
    it("transforms the given data for use with the store's persistence layer");
  });

  describe('.deserialize', function() {
    var MailingAddress = function($__super) {
      function MailingAddress() {
        var $__1 = $__Object$getPrototypeOf(MailingAddress.prototype);

        if ($__1 !== null)
          $__1.constructor.apply(this, arguments);
      }

      MailingAddress.__proto__ = ($__super !== null ? $__super : Function.prototype);
      MailingAddress.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

      $__Object$defineProperty(MailingAddress.prototype, "constructor", {
        value: MailingAddress
      });

      $__Object$defineProperty(MailingAddress.prototype, "schema", {
        get: function() {
          return {
            name: attr(String),
            apartment: attr(Number),
            house: attr(Number),
            street: attr(String),
            city: attr(String),
            state: attr(String),
            zip: attr(Number)
          }
        },

        enumerable: false
      });

      return MailingAddress;
    }(Model);

    var Person = function($__super) {
      function Person() {
        var $__2 = $__Object$getPrototypeOf(Person.prototype);

        if ($__2 !== null)
          $__2.constructor.apply(this, arguments);
      }

      Person.__proto__ = ($__super !== null ? $__super : Function.prototype);
      Person.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

      $__Object$defineProperty(Person.prototype, "constructor", {
        value: Person
      });

      $__Object$defineProperty(Person.prototype, "schema", {
        get: function() {
          return {
            name: attr(String),
            address: attr(MailingAddress)
          }
        },

        enumerable: false
      });

      return Person;
    }(Model);

    Person.store = new (function($__super) {
      function $__3() {
        var $__4 = $__Object$getPrototypeOf($__3.prototype);

        if ($__4 !== null)
          $__4.constructor.apply(this, arguments);
      }

      $__3.__proto__ = ($__super !== null ? $__super : Function.prototype);
      $__3.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

      $__Object$defineProperty($__3.prototype, "constructor", {
        value: $__3
      });

      $__Object$defineProperty($__3.prototype, "findAll", {
        value: function() {
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
        },

        enumerable: false,
        writable: true
      });

      $__Object$defineProperty($__3, "deserialize", {
        value: function(data) {
          data.name = "" + data.firstName + " " + data.lastName + "";
          return data;
        },

        enumerable: false,
        writable: true
      });

      return $__3;
    }(Store));

    it("transforms data from the store for use with your constructor", function() {
      return Person.findAll().then(function(people) {
        var person = people[0];
        expect(person.name).to.equal("Curtis Steckel");
      });
    });
  });
});
