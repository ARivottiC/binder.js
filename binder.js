;(function ( window ) {
    /* jshint laxcomma: true */
    "use strict";

    var
        /*
         *  Aliases
         */
        arrayProto = Array.prototype
      , each       = arrayProto.forEach
      , filter     = arrayProto.filter
      , indexOf    = arrayProto.indexOf
      , map        = arrayProto.map
      , pop        = arrayProto.pop
      , push       = arrayProto.push
      , shift      = arrayProto.shift
      , slice      = arrayProto.slice
      , splice     = arrayProto.splice

        /*
         *  Internal objects, variables 
         */
      , oGroup    = {}
      , oTemplate = {}
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

    //
    function Dummy() {}

    /*
     *  Functions
     */

    //
    function define( name, ExtClass ) {
        var impClasses = slice.call( arguments, 2 )
          , length     = impClasses.length
          , override   = ( impClasses.pop() || {} ) // TODO: avoind creating unecessary object
          ;

        /* jshint laxbreak:true, -W054 */
        var Class = (
            new Function(
                "c",
                'return function '
                    + name 
                    + '(e,p,a) { c.call(this,e,p,a) }'
            )
        )( override.constructor === Object ? ExtClass : override.constructor );

        // yes i know, Object.create...
        Dummy.prototype = ExtClass.prototype;

        Class.prototype = new Dummy();

        for ( var i = 0; i < length - 1; i++ ) {
            var ImpClass = impClasses[ i ];
            merge( Class.prototype, ImpClass.prototype );
        }

        merge( Class.prototype, override );

        Class.prototype.constructor = Class;

        /* jshint boss: true */
        return ( Binder[ name ] = Class );
    }

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
        else if ( Binder[ val ] )
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

    /*
     * Object functions
     */

    // add a class to object's element.
    //  requires a regexp to check for existence and the class to add
    function addClass( obj, regexp, val ) {
        var elem = obj.elem;
        if ( ! hasClass( obj, regexp ) )
            elem.className = elem.className.concat( ' ', val ).trim();
        return obj;
    }

    // push a child to an Array like object 
    //  if an index is given, splice it to that position 
    function attach( obj, child, index ) {
        if ( isUndef( index ) )
            return push.call( obj, child );

        splice.call( obj, index, 0, child );

        return child;
    }

    // attach a child to a parent
    //  of the object is an Prepender, set index to 0
    //  if an index is given, attach it to that parent's position
    function attachChild( obj, child, index ) {
        /* jshint laxbreak: true */
        var isAppender = ! obj.length      // empty, push allways work 
                      || isUndef( index )  // index is not defined 
                      || ! obj[ index ]    // or doesn'ts have that child
                      || index !== 0       // or index not 0 
          , childElem  = child.elem
          , parentElem = obj.elem
          ;

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

            if ( ! isNull( child.getAttribute( Binder.defaultAttr ) ) )
                obj.attach( child );
            else
                attachChildren( obj, child );
        }
    }

    // associate a template to a object
    function attachTemplate( obj, elem, arg ) {
        var guid     = obj.guid
          , tmplAttr = Binder.defaultAttr + '-tmpl'
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

    // dettach a child from an Array like object
    function dettach( obj, elem ) {
        if ( isUndef( elem ) )
            return pop.call( obj ); 

        var index = indexOf.call( obj, elem );
        if ( ! isUndef( index ) )
            return splice.call( obj, index, 1 ).pop();
    }

    // check if object's element has a given class set
    function hasClass( obj, regexp ) {
        return regexp.test( obj.elem.className );
    }

    function isHidden( obj ) { return obj.isHidden(); }
    function isSelected( obj ) { return obj.isSelected(); }

    //
    function no( obj, event, fn ) {
        // TODO: check/remove listeners 
        var elem = obj.elem;
        return elem.removeEventListener.apply( elem, arguments ); 
    }

    //
    function on( obj, event, fn, capture ) {
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
                var result = fn.call( obj, event );
                if ( result === false ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                return result;
            } 
        );

        return obj.elem.addEventListener( event, listener, capture ); 
    }

    // remove object's element class
    function remClass( obj, regexp ) {
        var elem = obj.elem;
        elem.className = elem.className.replace( regexp, '' ).trim();
        return obj;
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

    // make the first position of a string uppercase
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
    function BinderCollection() { push.apply( this, arguments ); }

    // yes i know, Object.create...
    Dummy.prototype = Array.prototype;

    var binderColProto = BinderCollection.prototype = new Dummy()
      , binderColSlice = binderColProto.slice
      ;

    merge( binderColProto, {
        // execute a given method in all children
        exec: function ( fn ) {
            var args = splice.call( arguments, 1 );
            this.forEach( function ( child ) { 
                child[ fn ].apply( child, args ); 
            });
            return this;
        }

        // returns a BinderCollection (see Array.filter)
      , filter: function () {
            return this.slice.apply( filter.apply( this, arguments ) );
        }

        // returns all hidden children
      , isHidden: function () { return this.filter( isHidden ); }

        // returns all selected children
      , isSelected: function () { return this.filter( isSelected ); }

        // returns a BinderCollection (see Array.map)
      , map: function () {
            return this.slice.apply( map.apply( this, arguments ) );
        }

        // returns a BinderCollection (see Array.slice)
      , slice: function () {
            var obj = new BinderCollection();
            obj.push.apply( obj, slice.apply( this, arguments ) );
            return obj;
        }

        // returns a BinderCollection (see Array.splice)
      , splice: function () {
            return this.slice.apply( splice.apply( this, arguments ) );
        }
    });

    binderColProto.constructor = BinderCollection;

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
            var obj = this;

            // TODO: the idea is to check if elem is a string or number,
            //  check for a better way
            if ( ! elem.nodeType ) {
                elem = oTemplate[ obj.guid ][ elem ].cloneNode( true ); // TODO: re-evaluate template
            }

            // Merge arg with attr configuration
            arg = merge( 
                    { class: Binder.defaultClass } 
                  , inflateVal( elem.getAttribute( Binder.defaultAttr ) ) 
                  , arg
                );

            // if this is a template, attach it and exit
            if ( attachTemplate( obj, elem, arg ) )
                return ;

            var Constructor = Binder[ arg.class ];

            if ( isUndef( Constructor ) )
                throw "can't use " + arg.class + ", maybe you forgot to set it?";

            var child = new Constructor( elem, obj, arg )
              , name  = child.name
              ;

            if ( ! isA( child, Binder ) )
                throw "not a Binder Object!";

            // if a name was given, used as a parent's method
            //  TODO: check if already exists
            if ( ! isUndef( name )  )
                child.context[ name ] = child;

            attachChild( obj, child, arg.index );

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
                    var array = binderColProto.slice.call( obj );
 
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

      , deselect  : function () { return remClass( this, rSelected ); }
      , isHidden  : function () { return hasClass( this, rHidden ); }
      , isSelected: function () { return hasClass( this, rSelected ); }
      , hide      : function () { return addClass( this, rHidden, 'hidden' ); }
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
      , select: function () { return addClass( this, rSelected, 'selected'); }
      , show  : function () { return remClass( this, rHidden ); }
      , swap  : function ( sibling ) {
            var parent = this.parent;

            // TODO: check parent

            var index1 = indexOf.call( parent, this )
              , index2 = indexOf.call( parent, sibling )
              ;

            if ( index2 < 0 )
                return false; // TODO: maybe not the best solution...

            parent[ index1 ] = splice.call( 
                    parent, index2, 1, parent[ index1 ] 
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

            if ( isObj( val ) ) {
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

                return obj;
            }
            else
                return obj.value( val );
        }
        // get the content of the object. Set the content if a value is given
      , value: function ( val ) {
            var obj  = this
              , elem = obj.elem
              ;

            if ( isUndef( val ) )
                return elem.innerHTML;

            // Setting value will change innerHTML, destroy all children
            while ( obj.length )
                obj.dettach();

            /* jshint boss: true */
            return ( elem.innerHTML = val );
        } 
    }
    , Binder.prototype.constructor = Binder
    , Binder.VERSION = '3.0.4'

    /*
     * Static object functions
     */
    , Binder.define = define
    , Binder.no     = no
    , Binder.on     = on

    /*
     * Attributes intended to be override 
     */
      // default attribute name
    , Binder.defaultAttr = 'data-binder'

    // default class name
    , Binder.defaultClass = 'Binder'

    /*
     * Binder Classes
     */
    , Binder.Binder = Binder
    ;

    window.Binder = Binder;
})( window );
