/* jshint laxcomma: true */
;(function ( window ) {
    "use strict";

    var 
        /* 
         *  Aliases 
         */
        aP      = Array.prototype
      , each    = aP.forEach
      , filter  = aP.filter
      , indexOf = aP.indexOf
      , pop     = aP.pop
      , push    = aP.push
      , shift   = aP.shift
      , slice   = aP.slice
      , splice  = aP.splice
         
        /* 
         *  Internal objects, variables 
         */
      , oGroup    = {} 
      , oTemplate = {}
      , oObject   = { 'Binder': Binder }
      , oListener = {}
      , guid      = 1

        /* 
         * Regular Expressions
         */
      , rComa      = /\s*,\s*/
      , rDColumn   = /\s*:\s*/
      , rSpaces    = /\s+/
      , rSelected  = /(?:^|\s+)selected(?!\S)/
      , rHidden    = /(?:^|\s+)hidden(?!\S)/
      ;

    /* 
     *  Functions 
     */

    // return the id(or name) attribute value from an element
    function getIdOrName( elem ) {
        return elem.getAttribute('id') || elem.getAttribute('name');
    }

    // Check if a given object has a given key
    function has( obj, key ) { return hasOwnProperty.call( obj, key ); }

    // Inflate a value as Binder arguments object
    function inflateVal( val ) {
        var obj = {};

        if ( val.match( rDColumn ) ) {
            var options = val.split( rComa );
            for ( var key in options ) {
                var value = options[ key ].split( rDColumn );
                obj[ value.shift() ] = value.shift();
            }
        } 
        // Is a Class
        else if ( object( val ) )
            obj.class = val;
        // Is Name
        else
            obj.name = val;

        return obj;
    }

    // Check if one object is an instance of another
    function isA( obj1, obj2 ) { return obj1 instanceof obj2; }

    // Check if a given value is a function
    function isFn( val ) { return typeof val === 'function'; }

    // Check if a given value is null
    function isNull( val ) { return val === null; }

    // Check if a given value is an object
    function isObj( val ) { return val === Object( val ); }

    // Check if a given value is undefined 
    function isUndef( val ) { return val === void 0; }

    // Merge 2 or more given objects
    function merge( /* obj1, obj2[, obj3]*/ ) {
        var merged = shift.call( arguments ) || {};

        each.call( arguments, function ( obj ) {
            if ( obj ) 
                for ( var key in obj )
                    merged[ key ] = obj[ key ];
        });

        return merged;
    }

    // get an object by a class name. set the object if given
    //  TODO: maybe object is not a good name
    function object( name, ExtClass ) {
        if ( isUndef( name ) )
            return void 0;

        if ( ExtClass ) {
            var impClasses = slice.call( arguments, 2 )
              , length     = impClasses.length
              , override   = impClasses.pop()
              ; 
        
            var Class = (
                new Function(
                    "c",
                    'return function ' 
                        + name 
                        + '(e,p,a) { c.call(this,e,p,a) }'
                )
            )( override.constructor === Object ? ExtClass : override.constructor );

            Class.prototype = Object.create( ExtClass.prototype );

            for ( var i = 0; i < length - 1; i++ ) {
                var ImpClass = impClasses[ i ];
                merge( Class.prototype, ImpClass.prototype );
            }

            merge( Class.prototype, override );

            Class.prototype.constructor = Class;

            oObject[ name ] = Class;
        }

        return oObject[ name ];
    }

    /* 
     * Object functions 
     */

    //
    function addClass( obj, regexp, val ) {
        var elem = obj.elem;
        if ( ! hasClass( obj, regexp ) )
            elem.className = elem.className.concat( ' ', val ).trim();
    }

    // 
    function attach( obj, child, index ) {
        if ( isUndef( index ) )
            return push.call( obj, child );

        splice.call( obj, index, 0, child );

        return child;
    }

    function attachChild( obj, child, index ) {
        var isAppender = ! obj.length      // empty, push allways work 
                      || isUndef( index )  // index is not defined 
                      || ! obj[ index ]    // or doesn'ts have that child
          , childElem  = child.elem
          , parentElem = obj.elem
          ;

        if ( obj.isPrepender && obj.length ) {
            index      = 0;
            isAppender = false;
        }

        // add element to the dom if the element has no parent
        if ( ! childElem.parentNode )
            if ( isAppender )
                parentElem.appendChild( childElem );
            else
                parentElem.insertBefore( childElem, obj[ index ].elem );

        attach( obj, child, index );
    }

    // search children elements, width binder attribute set, and attach
    function attachChildren( obj, elem ) {
        var children = slice.call( elem.children );

        while ( children.length ) {
            var child = children.shift();

            // TODO: check if is an elemet. IE up to 8 considers comments as children... :S

            if ( ! isNull( child.getAttribute( Binder.attr ) ) )
                obj.attach( child );
            else
                attachChildren( obj, child );
        }
    }

    // 
    function attachTemplate( obj, elem, arg ) {
        var guid     = obj.guid
          , tmplAttr = Binder.attr + '-tmpl'
          , tmplName = elem.getAttribute( tmplAttr );

        if ( isNull( tmplName ) ) 
            return ;

        var templates =  oTemplate[ guid ] || ( oTemplate[ guid ] = [] );

        if ( tmplName )
            templates[ tmplName ] = elem;

        templates.push( elem );

        elem.removeAttribute( tmplAttr );
        elem.parentNode.removeChild( elem );

        return elem;
    }

    // 
    function dettach( obj, elem ) {
        if ( isUndef( elem ) )
            return pop.call( obj ); 

        var index = indexOf.call( obj, elem );
        if ( ! isUndef( index ) )
            return splice.call( obj, index, 1 ).pop();
    }

    //
    function hasClass( obj, regexp ) {
        return regexp.test( obj.elem.className );
    }

    //
    function remClass( obj, regexp ) {
        var elem = obj.elem;
        elem.className = elem.className.replace( regexp, '' ).trim();
    }

    // add is* methods based on type
    function setIsProp( obj, val ) {
        if ( isUndef( val ) )
            return false;

        var types = val.split( rSpaces );

        while ( types.length )
            obj[ 'is' + ucFirst( types.shift() ) ] = true;

        return true;
    }

    //
    function ucFirst( obj ) {
        return obj.replace( 
                /^[a-z]/, function ( val ) { return val.toUpperCase(); }
            );
    }

    /*
     * BinderCollection
     *  Array object intended to store a collection of Binder objects with
     *  methods that affects all children 
     */
    function BinderCollection() { Array.prototype.push.apply( this, arguments ); }
    var lP = BinderCollection.prototype = Object.create( Array.prototype );

    // array returning methods should allways return a BinderCollection 
    ['filter','map', 'slice', 'splice'].forEach( function ( fn ) {
        lP[ fn ] = function() {
            var obj = new BinderCollection();
            obj.push.apply( 
                obj, Array.prototype[ fn ].apply( this, arguments ) 
            );
            return obj;
        };
    });

    // TODO: add is* methods

    // allow to execute binder methods in all childen
    ['deselect', 'select', 'hide', 'on', 'show'].forEach( function ( fn ) {
        lP[ fn ] = function() {
            this.forEach( function ( child ) { 
                child[ fn ].apply( child, arguments ); 
            });
            return this;
        };
    });
    lP.constructor = BinderCollection;


    /* 
     * Binder 
     */
    function Binder( elem, parent, args ) {
        args = args || {};

        var obj = this;
        obj.elem = elem;

        // Guid
        obj.guid = guid++;

        // Group
        var c = args.group || obj.group;
        if ( c ) {
            obj.group = ( 
                oGroup[ c ] || ( oGroup[ c ] = new BinderCollection() ) 
            );
            obj.group.push( obj );
        }

        // Get the object name (for path relation) and fix the name 
        //  if needed
        var name = args.name || getIdOrName( elem );
        if ( name )
            obj.name = name;

        setIsProp( obj, args.type ); 
        
        if ( isObj( parent ) ) {
            obj.root    = parent.root || parent;
            obj.context = parent.isContext ? parent : parent.context;
            obj.parent  = parent; 
        }
        else
            obj.root = obj.context = obj; // TODO: is this really needed???

        attachChildren( obj, elem ); 

        return obj;       
    }

    Binder.prototype = {
        // attach a child to the object 
        attach  : function ( elem, arg ) {
            // Merge arg with attr configuration
            arg = merge( 
                    { class: Binder.class } 
                  , inflateVal( elem.getAttribute( Binder.attr ) ) 
                  , arg
                );

            // if this is a template, attach it and exit
            if ( attachTemplate( this, elem, arg ) )
                return ;

            var Constructor = object( arg.class );

            if ( isUndef( Constructor ) )
                throw "can't use " + arg.class + ", maybe you forgot to set it?";

            var parent = this
              , child  = new Constructor( elem, parent, arg )
              , name   = child.name;

            if ( ! isA( child, Binder ) )
                throw "not a Binder Object!";

            // if a name was given, used as a parent's method
            //  TODO: check if allready exists
            if ( ! isUndef( name )  )
                child.context[ name ] = child;

            attachChild( parent, child, arg.index );

            return child;
        }

        // returns a BinderCollection of this object's children 
        //  if an object is given and is a child, returns that child
        //  if a name or number is given, and the child exists, returns if
        //  if a function is givem. use that function as a filter
        //  undefined returns all children
      , children: function ( val ) {
            var obj = this;

            switch ( typeof val ) {
                case "object":
                    if ( indexOf.call( obj, val ) >= 0 )
                        return new BinderCollection( val );

                    break;
                case "string":
                case "number":
                    if ( has( obj, val ) )
                        return new BinderCollection( obj[ val ] );

                    break;
                default:
                    var array = lP.slice.call( obj );
 
                    if ( isFn( val ) )
                        return array.filter( val );

                    return array;
            }
        }

        // cleans up all the references and support data related to this
        //  object.
      , destructor: function () {
            var obj = this;

            obj.value( null );

            var group = obj.group;
            if ( group ) {
                var index = indexOf.call( group, obj );
                if ( index >= 0 ) {
                    group[ index ] = null;
                    group.splice( index, 1 );
                }
                obj.group = null;
            }

            // destroy any templates
            oTemplate[ obj.guid ] = null;

            //remove o from the dom
            obj.elem.parentNode.removeChild( obj.elem );
            obj.elem = null;

            obj.context = null;
            obj.parent  = null;
            obj.root    = null;
        }

        // dettach a object's child
        //  if a child is given, dettach it
        //  else pop's the last object's child
      , dettach: function ( child ) {
            var obj = dettach( this, child );

            if ( isUndef( obj ) )
                return;

            if ( ! isUndef( obj.name ) )
                delete obj.context[ obj.name ];

            obj.destructor();
            obj = null;
        }

      , deselect  : function () { remClass( this, rSelected ); }
      , IsHidden  : function () { return hasClass( this, rHidden ); }
      , isSelected: function () { return hasClass( this, rSelected ); }
      , hide      : function () { addClass( this, rHidden, 'hidden' ); }
      , length    : 0
      , next      : function () {
            var parent = this.parent;

            // TODO: maybe return a BinderCollection?
            if ( parent ) {
                var index = indexOf.call( parent, this );
                if ( index < parent.length - 1 ) 
                    return parent[ index + 1 ];
            }

            return false;
        }
      , no        : function ( event, fn ) {
            // TODO: check/remove listeners 
            var elem = this.elem;
            elem.removeEventListener.apply( elem, arguments ); 
        }
      , on        : function ( event, fn, capture ) {
            var obj = this; // "This" can't be minified...
            // TODO: capture support?

            // no function given, assume object's method with event name
            fn = fn || obj[ event ];

            // add a unique id to the function to be easyly indexed 
            fn.guid = fn.guid || guid++;

            // get listeners for this object ( set if first time )
            var oL = oListener[ obj.guid ] || ( oListener[ obj.guid ] = {} );

            // get listeners for this object + event ( set if first time )
            var eL = oL[ event ] || ( oL[ event ] = {} );

            // get the listener for this object + event + function ( set if first time )
            var listener = eL[ fn.guid ] || ( 
                eL[ fn.guid ] = function ( event ) {
                    return fn.call( obj, event );
                } 
            );

            obj.elem.addEventListener( event, listener, capture ); 

            return obj;
        }
      , prev: function () {
            var parent = this.parent;

            // TODO: maybe return a BinderCollection?
            if ( parent ) {
                var index = indexOf.call( parent, this );
                if ( index > 0 ) 
                    return parent[ index - 1 ];
            }

            return false;
        }
      , select: function () { addClass( this, rSelected, 'selected'); }
      , show  : function () { remClass( this, rHidden ); }
      , swap  : function ( sibling ) {
            var parent = this.parent;

            // TODO: check parent

            var index1 = indexOf.call( parent, this )
              , index2 = indexOf.call( parent, sibling )
              ;

            if ( index2 < 0 ) 
                return false; // TODO: maybe not the best solution...

            this[ index1 ] = splice.call( 
                    this, index2, 1, this[ index1 ] 
                ).pop();

            var a = this.elem;
            var b = sibling.elem;
            var t = a.parentNode.insertBefore(
                    document.createTextNode(''), a
                );

            b.parentNode.insertBefore(a, b);
            t.parentNode.insertBefore(b, t);
            t.parentNode.removeChild(t);

            return [ index1, index2 ];
        }
      , toString: function () { return '[object Binder]'; }
      , update  : function ( val ) {
            var obj = this;

            if ( Array.isArray( val ) ) {
                each.call( val, function ( value, index ) {
                    var child;

                    if ( has( obj, index ) && !( obj.isAppender || obj.isPrepender ) )
                        child = obj[ index ];
                    else {
                        // TODO: move to Appender object
                        var template = value.template || 0
                          , elem     = oTemplate[ obj.guid ][ template ].cloneNode( true ) // TODO: re-evaluate template
                          ;

                        delete value.template;

                        child = obj.attach( elem );
                    }

                    child.update( value );
                });
            } 
            else if ( isObj( val ) ) {
                for ( var key in val ) {
                    var value = val[ key ];
                    var child = obj[ key ];

                    if ( isFn( child ) ) 
                        child.call( obj, value );
                    else if ( has( obj, key ) )
                        if ( isA( child, Binder ) )
                            child.update( value );
                        else
                            obj[ key ] = value;
                }
            }
            else
                return obj.value( val );
        }
        // get the content of the object. Set the content if a value is given
      , value: function ( val ) {
            var obj  = this
              , elem = obj.elem
              ;

            if ( isNull( val ) )
                while ( obj.length )
                    obj.dettach();

            if ( ! isUndef( val ) )
                elem.innerHTML = val;

            return ( val || elem.innerHTML );
        } 
    }
    , Binder.prototype.constructor = Binder
    , Binder.VERSION = '3.0.0'

    /*
     * Static object functions
     */
    , Binder.utils  = {
        merge : merge
      , object: object
    }

    /*
     * Attributes intended to be override 
     */
      // default attribute name
    , Binder.attr = 'data-binder'

    // default class name
    , Binder.class = 'Binder'
    ;

    window.Binder = Binder;
})( window );

;(function ( Binder ) {
    var u = Binder.utils;

    u.object('Header', Binder, {
        constructor: function ( elem, parent, args ) {
            Binder.call( 
                this, elem, parent, 
                u.merge( { name: 'Header' }, args )
            );

            this.on('click');
        }
      , click: function () { console.log( arguments ); }
    });
})( Binder );
