var $__Object$defineProperty = Object.defineProperty;
var $__Object$create = Object.create;

var NotImplementedError = function($__super) {
  function NotImplementedError(message) {
    this.name = "NotImplementedError";
    this.message = message || "";
  }

  NotImplementedError.__proto__ = ($__super !== null ? $__super : Function.prototype);
  NotImplementedError.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

  $__Object$defineProperty(NotImplementedError.prototype, "constructor", {
    value: NotImplementedError
  });

  return NotImplementedError;
}(Error);

module.exports = NotImplementedError;
