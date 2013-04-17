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

    define('AppListAdd', Binder, {
        constructor: function ( elem, parent, args ) {
            var obj = this;
            obj.name = 'Add';

            Binder.apply( obj, arguments );

            on( obj, 'click' );
        }
      , click: function () { 
            this.context.Container.update([ 
                { Value: 'Random value: ' + Math.random() } 
            ]);
        }
    });

    define('AppListDel', Binder, {
        constructor: function ( elem, parent, args ) {
            var obj  = this;
            obj.name = 'Del';

            Binder.apply( obj, arguments );

            on( obj, 'click' );
        }
      , click: function () { 
            var item = this.context;
            item.context.dettach( item );
        }
    });

    define('AppListSel', Binder, {
        constructor: function ( elem, parent, args ) {
            var obj  = this;
            obj.name = 'Sel';

            Binder.apply( obj, arguments );

            on( obj, 'click' );
        }
      , click: function () {
            if ( this.isSelected() ) 
                return false;

            var item = this.context;
            item.group.isSelected().exec('deselect');
            item.select();
        }
    });
})( Binder );
