// FIXME These need to not suck

exports.enforceSubClassing = function(Ctor, Class) {
  if (Ctor === Class) {
    throw new Error("You must sub class [Ctor].");
  }
};

exports.enforceNewKeyword = function(context, Class) {
  if (!(context instanceof Class)) {
    throw new Error("You must use the new keyword");
  }
};
