;(function ( Binder ) {
    /* jshint laxcomma: true */
    "use strict";

    var object = Binder.object
      , define = Binder.define
      , on     = Binder.on
      ;

    define('AppButton', Binder, {
        constructor: function () {
            Binder.apply( this, arguments );
            Binder.on( this, 'click' );
        }
      , click: function () { alert('Hello World!'); }
    });

    define('AppList', Binder, {
        constructor: function ( elem, parent, args ) {
            var obj = this;
            obj.name      = 'List';
            obj.isContext = true;

            Binder.call( obj, elem, parent, args );
        }
    });

    define('AppListAdd', Binder, {
        constructor: function ( elem, parent, args ) {
            var obj = this;
            obj.name = 'Add';

            Binder.call( obj, elem, parent, args );

            on( obj, 'click' );
        }
      , click: function () {
            this.context.Container.attach(0);
        }
    });

    define('AppListRem', Binder, {
        constructor: function ( elem, parent, args ) {
            var obj = this;

            Binder.call( obj, elem, parent, args );

            on( obj, 'click' );
        }
      , click: function () {
            this.context.Container.dettach( this );
        }
    });

    define('AppListContainer', Binder, {
        constructor: function ( elem, parent, args ) {
            var obj = this;
            obj.name       = 'Container';
            obj.isAppender = true;

            Binder.call( obj, elem, parent, args );
        }
    });

    define('SelectItem', Binder, {
        constructor: function() {
            Binder.apply(this, arguments);
            Binder.on( this, 'click' );
        },
        click: function () {
            if (this.isSelected()) { this.deselect(); }
            else                   { this.select();   }
        }
    });

})( Binder );
