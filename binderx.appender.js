;(function ( Binder ) {
    /* jshint laxcomma: true */
    "use strict";

    var define = Binder.define;

    var Appender = define('Appender', Binder, {
        update  : function ( val ) {
            var obj = this;

            if ( Array.isArray( val ) ) {
                Array.prototype.forEach.call( val, function ( value, index ) {
                    var child = obj.attach( value.template || 0 );
                    if ( value !== void 0 ) {
                        delete value.template;
                        child.update( value );
                    }
                });

                return obj.children();
            }

            return Binder.prototype.update.call( obj, val );
        }
    });

    define('Prepender', Appender, {
        attach: function ( elem, arg ) {
            if ( arg )
                arg.index = 0;
            else
                arg = { index: 0 };

            return Appender.prototype.attach.call( this, elem, arg );
        }
    });

})( Binder );
