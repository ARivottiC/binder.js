;(function ( Binder ) {
    /* jshint laxcomma: true */
    "use strict";

    Binder.define('Updater', Binder, {
        update  : function ( val ) {
           var obj = this;

            if ( Array.isArray( val ) ) {
                Array.prototype.forEach.call( val, function ( value, index ) {
                    /* jshint laxbreak: true */
                    var child = hasOwnProperty.call( obj, index )
                              ? obj[ index ]
                              : obj.attach( value.template || 0 )
                              ;

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

})( Binder );
