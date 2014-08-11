var Model = require('./lib/model'),
    Store = require('./lib/store'),
    AttributeDescriptor = require('./lib/attribute-descriptor');

// FIXME gross
Model.AttributeDescriptor = AttributeDescriptor;
Model.Store = Store;

module.exports = Model;
