;(function ( Binder ) {
    /* jshint laxcomma: true */
    "use strict";

    var define = Binder.define
      , on     = Binder.on
      ;

    var AppButton = define('AppButton', Binder, {
        constructor: function () {
            Binder.apply( this, arguments );
            on( this, 'click' );
        }
    });

    define('AppController', Binder.Appender, {
        constructor: function () {
            this.isContext = true;
            Binder.apply( this, arguments );
        }
      , update: function ( val ) {
            if ( Array.isArray( val ) )
                return this.Container.update( val );

            return Binder.prototype.update.call( this, val );
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

            return this;
        }
    });

    define('AppForm', Binder, {
        constructor: function () {
            this.isContext = true;
            Binder.apply( this, arguments );
            on( this, 'submit');
        }
      , submit: function () {
            var text = this.Text
              , value = text.value();

            if ( value ) {
                // context.update knows what to do with this
                this.context.update([ value ]);
                text.value( null );
            } else
                this.Error.show();

            return false;
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
            return Binder.prototype.hide.call( this );
        }
      , show: function () {
            var obj = this;

            Binder.prototype.show.call( obj );
            clearTimeout( obj.timeout );

            obj.timeout = setTimeout(
                function () { obj.hide(); }, obj.delay
            );

            return obj;
        }
    });

    define('AppEdit', AppButton, {
        click: function () {
            var context = this.context;
            context.View.hide();
            context.Form.update({ Text: context.Value.value() } ).show();
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

    define('AppSel', Binder, {
        constructor: function () {
            Binder.apply( this, arguments );
            on( this, 'click', this.select );
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
        click: function () { return move( this.context, 'prev'); }
    });

    define('AppDown', AppButton, {
        click: function () { return move( this.context, 'next'); }
    });

    var AppTree = define('AppTree', Binder.Appender, {
        constructor: function () {
            this.isContext = true;
            Binder.Appender.apply( this, arguments );
        }
    });

    define('AppTreeItem', Binder, {
        constructor: function () {
            this.isContext = true;
            Binder.Appender.apply( this, arguments );
        }
    });

    define('AppTreeBranch', AppTree, {
        template: function ( name ) {
            return this.context.context.template( name );
        }
    });

})( Binder );
