/**
 * Basic event handler class that can be used to register and unregister
 * handlers in a concise and convenient way.
 *
 * Example:
 *
 *    let onChange = new EventHandler();
 *    let unregister = onChange.register(myCallback);
 *
 *    onChange.trigger('fooBar', 'baz');
 *    unregister();
 *
 * @constructor
 */
export function EventHandler () {

    let callbacks = [];

    Object.defineProperty(this, 'callbacks', {
        get: function() {
            return callbacks;
        }
    });

    /**
     * Register an arbitrary handler function. Returns a function that when
     * called will unregister the supplied handler.
     *
     * @param {Function} callback
     * @returns {Function} unregister handler
     */
    this.register = function (callback) {
        callbacks.push(callback);
        return function() {
            callbacks = callbacks.filter(function(item) {
                return (item !== callback);
            });
        };
    };

    /**
     * Execute registered handlers with the same args used to trigger.
     *
     */
    this.trigger = function () {
        let args = arguments;
        callbacks.forEach(function (handler) {
            if (typeof handler === 'function') {
                handler.apply(this, args);
            }
        });
    };

    /**
     * Remove all registered callbacks.
     */
    this.destroy = function() {
        callbacks.length = 0;
    };

}
