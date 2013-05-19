;(function ( Binder ) {
    /* jshint laxcomma: true */
    "use strict";

    var define = Binder.define
      , each   = Array.prototype.forEach
      , update = Binder.prototype.update
      ;

    var Appender = define('Appender', Binder, {
        update  : function ( val ) {
            var obj = this;

            if ( Array.isArray( val ) ) {
                each.call( val, function ( value, index ) {
                    var child = obj.attach( value.template || 0 );
                    if ( value !== void 0 ) {
                        delete value.template;
                        child.update( value );
                    }
                });

                return obj.children();
            }

            return update.call( obj, val );
        }
    });

    define('Input', Binder, {
        value: function ( val ) {
            var elem = this.elem;
       
            if ( val !== void 0 )
                elem.value = val;
        
            return elem.value; 
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

    define('Updater', Binder, {
        update  : function ( val ) {
           var obj = this;

            if ( Array.isArray( val ) ) {
                each.call( val, function ( value, index ) {
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

            return update.call( obj, val );
        }
    });

})( Binder );
