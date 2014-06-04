;(function ( Binder ) {
    /* jshint laxcomma: true */
    "use strict";

    Binder.define('ElemInput', Binder, {
        value: function ( val ) {
            var elem = this.elem;

            if ( val !== void 0 )
                elem.value = val;

            return elem.value;
        }
    });

})( Binder );
