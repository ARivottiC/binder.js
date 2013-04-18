;(function ( Binder ) {
    /* jshint laxcomma: true */
    "use strict";

    var object = Binder.object
      , define = Binder.define
      , on     = Binder.on
      ;

    var AppButton = define('AppButton', Binder, {
        constructor: function () {
            Binder.apply( this, arguments );
            on( this, 'click' );
        }
      , click: function () { alert('Hello World!'); }
    });

    define('AppController', Binder, {
        constructor: function () {
            this.isContext = true;
            Binder.apply( this, arguments );
        }
      , update: function ( val ) {
            if ( Array.isArray( val ) )
                return this.Container.update( val );

            return Binder.prototype.update( this, val );
        }
    });

    define('AppItem', Binder, {
        constructor: function () {
            this.isContext = true;
            this.group     = 'items';
            Binder.apply( this, arguments );
        }
      , update: function ( val ) { 
            this.Value.value( val ); 
            this.Form.hide();
            this.View.show();
        }
    });

    define('AppForm', Binder, {
        constructor: function () {
            this.isContext = true;
            Binder.apply( this, arguments );
            on( this, 'submit')
        }
      , submit: function ( event ) {
            var input = this.Input
              , value = input.value();

            if ( value ) {
                // context.update know's what to do with this
                this.context.update([ value ]);
                input.value( null );
            } else
                this.Error.show();

            if ( event )
                event.returnValue = false;
        }
    });

    define('AppInput', Binder, {
        value: function ( val ) {
            var elem = this.elem;
       
            if ( val !== void 0 )
                elem.value = val;
        
            return elem.value; 
        }
    });

    define('AppError', Binder, {
        constructor: function ( elem, parent, args ) {
            this.name = 'Error';
            this.delay = args.delay || 2000;
            Binder.apply( this, arguments );
        }
      , hide: function () {
            delete this.timeout;
            Binder.prototype.hide.call( this );
        }
      , show: function () {
            Binder.prototype.show.call( this );
            
            clearTimeout( this.timeout );

            var that = this;
            this.timeout = setTimeout( 
                function () { that.hide(); }, this.delay 
            );

            return this;
        }
    });

    define('AppEdit', AppButton, {
        click: function () { 
            var item = this.context;

            item.View.hide();
            item.Form.update({ Input: item.Value.value() } ).show();

            return false;
        }
    });

    define('AppDel', AppButton, {
        click: function () { 
            var item = this.context;
            item.context.dettach( item );
            return false;
        }
    });

    define('AppSel', AppButton, {
        click: function () {
            this.select();
            return false;
        }
      , select: function () {
            if ( ! this.isSelected() ) {
                var item = this.context;
                item.group.isSelected().exec('deselect');
                return AppButton.prototype.select.call( item );
            }
            return this;
        }
    });

    function move( obj, method ) {
        var sibling = obj[ method ]();

        if ( sibling )
            obj.swap( sibling );

        return false;   
    }

    define('AppUp', AppButton, {
        click: function () { move( this.context, 'prev') }
    });

    define('AppDown', AppButton, {
        click: function () { move( this.context, 'next') }
    });

})( Binder );
