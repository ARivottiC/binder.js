<b>
DEPRECATED!!!! See [doo.js](https://github.com/ARivottiC/doo.js)! 
</b>

binder.js
====================

Bind Javascript objects to HTML Elements.

Background
--------------------

**binder.js** is a fork of **JsBinder**, a lib used by Sonaecom's PD-Portal Team, in projects like www.optimus.pt, www.saphety.pt, www.clix.pt, www.optimusdiscos.pt and several [Clix TV](http://fibra.clix.pt//tv/) services. Since is a natural evolution from **JsBinder** v2, the first release of **binder.js** have the version 3.0.0..

**binder.js** were develop with the folowwing goals:

* use only standards and pure javascript
* small, clean and simple
* total independence between Javascript and HTML
* objects can be reused and extended in an easy way
* easy integration with other Javascript libs

Requires
--------------------

**binder.js** was made for modern browsers. That said, if you want to use it older browsers, you must make sure to support the following: 

* `Array`.`isArray`
* `Array`.`prototype`.`forEach`
* `Array`.`prototype`.`filter`
* `Array`.`prototype`.`indexOf`
* `Array`.`prototype`.`map`
* `Array`.`prototype`.`slice`
* `Element`.`prototype`.`classList`

The following are only required if using the corresponding functionality:

* `JSON`.`parse` for [HTML comments](#html-comments)
* `Window`.`prototype`.`addEventListener` for [on](#on)
* `Window`.`prototype`.`removeEventListener` for [no](#no) (eventually)

Thera are allready several Polyfills that cover the above. If you never used polyfills, or don't know where to start, consider [Jonatan Neal's polyfill](https://github.com/jonathantneal/polyfill).

### CSS ###

You must set the following **CSS** in order to use **binder.js**:

```css
.selected { font-weight: bold }
.hidden, [data-binder-tmpl] {
    display: none !important;
    visibility: hidden; 
}
```

Usage
--------------------

```html
<body>
    <h1 data-binder>Header</h1>

    <a href="#" data-binder="AppButton">Click Me</a>    

    <script src="binder.js"></script>

    <script type="text/javascript">
        (function ( Binder ) {
            Binder.define('AppButton', Binder, {
                constructor: function () {
                    Binder.apply( this, arguments );
                    Binder.on( this, 'click' );
                },
                click: function () { alert('Hello World!'); }
            });
        })( Binder );

        app = new Binder( document.body );
    </script>
</body>
```

See more [Binder Examples](docs/index.html).

HTML Attributes
--------------------

### *data-binder*[="`value`|`key`: `value`, ..."] ###

Attach the element as a `Binder` object.

* **`value`**

    When the value is a valid class, set **class**, else, set **name**. 

* **`key`: `value`, ...**
    * **class**

        The object's class. Default is [`Binder.defaultClass`][defaultClass].

    * **group**

        The object group. See [*`group`* attribute][groupAttr]. Default is *undefined*. 

    * **name**

        The context's method name. See [*`context`* attribute][contextAttr]. Default is *none*.

    * **type**
        
        Space separeted names. Each type will be transform in a is* attribute with value true.


### *data-binder-tmpl*[="`name`"] ###

Attach the element as a template. By default **`name`** is the attach order.

HTML Comments 
--------------------

It's also possible to configure a Binder object using JSON in HTML comments:

```html
<div data-binder><!--
    binder: {
        "name": "Table"
      , "class": "AppController"
    }
--></div>
```

The same thing but with attributes:

```html
<div data-binder="name: Table, class: AppController"></div>
```

Class Attributes
--------------------

### *defaultAttr* ###

The HTML attribute name that identifies an element as a `Binder` object. Default is *data-binder*.

### *defaultClass* ###

The class name used when the *class* options is not defined. default is `Binder`.

Class Methods
--------------------

### *define*(`name`, `extend`[, `implement`, ...], `override`) ###

Defined a new `Binder` class and return it.

* **`name`**

    A `String` with the class name.

* **`extend`**

    A `Binder` class to extend from.

* **`implement`**

    One or more `Binder` classes to implement.

* **`override`**

    An `Object` with custom functions for the new class. 


### *no*(`object`, `event`, `function`) ###

Remove an event from object.

* **`object`**

    A `Binder` object.

* **`event`**

    A `String` with the event name.

* **`function`**

    A `Function` to be removed. If *undefined* will assume **`object`**[**`event`**]. TODO: if *null*, clear all object events. 


### *on*(`object`, `event`, `function`) ###

Add an event to object and returns it. 

* **`object`**

    A `Binder` object.

* **`event`**

    A `String` with the event name.

* **`function`**

    A `Function` to be executed on event trigger. If *undefined* will assume **`object`[`event`]**.


Object Attributes
--------------------

### *context* ###

Returns the context object.

### *elem* ###

Returns the `HTML Element`.

### *group* ###

Returns a `BinderCollection` will all the objects of the same group.

### *parent* ###

Returns the parent object.

### *root* ###

Returns the root object. The root object is the first object binded.

Object Methods
--------------------

### *attach*(`elem`|`template`[, `args`]) ###

Attach a child to object and returns it.

* **'elem`**
    
    An `HTML Element` node. 

* **'template`**

    A `String`, to identify the template's name or `Number` to identify the template's position to use.

* **'args`**

    An `Object` with configuration options.  


### *children*([`function`|`index`]) ###

Returns a `BinderCollection` with all th object's children.

* **`function`**

    A `Function` to filter children;

* **`index`**

    A `Number` to filter by children index.

### *destructor*() ###

Object destructor.

### *dettach*([`child`]) ###

Dettach an object's child. If no `child` is given, dettach the last child.

* **`child`**

    A `Number` with the child's index to be removed.

### *deselect*() ###

Remove selection mark from object. Returns *object*.

### *isHidden*() ###

Check if current object is hidden. Returns `true` or `false`.

### *isSelected*() ###

Check if object is marked as selected. Returns `true` of `false`.

### *hide*() ###

Mark object as hidden. Returns *object*.

### *next*() ###

Returns the next sibling or `false`.

### *prev*() ###

Returns the previous sibling or `false`.

### *select*() ###

Mark object as selected. Returns *object*.

### *show*() ###

Remove hidden mark from object. Returns *object*.

### *swap*(`sibling`) ###

Swap object with `sibling`. Retuns an `Array`with the swapped indexes.

* **`sibling`**

    A `Binder` object with the same parent.


### *template*([`String`|`Number`]) ###

Returns a template element by name or position.

* **`String`**

    Returns a template element by name. 

* **`Number`**

    Returns a template element by position. 


### *update*([`Object`|`String`|`null`]) ###

Update the object. Return values may vary.

* **`Object`**

    For each *key*, in `Object`:
        * is a `Function`, call it using *value* as parameter;
        * is a child, call *`child`.`update`* using *value* as parameter;
        * is an attribute, update it;
    Returns *object*.

* **`String`|`null`** or no value supplyed.

    Returns *object.value* using *value* as parameter. 


### *value*([`value`|`null`]) ###

Returns the element's innerHTML value.

* **`value`** 

    Change the element's innerHTML. This implies dettaching all children;

* **`null`** 

    Change the element's innerHTML to null. This implies dettaching all children;


BinderCollection
--------------------

... is an `Array` of `Binder` objects. Some functions where override to return a new `BinderCollection` but they work as expected.

### *exec*(`method`[, `arg1`, `arg2`, ...]) ###

Execute the given method, with given args, on each item.

### *filter*(...) ###

See `Array`.`filter`. Returns a `BinderCollection`.

### *isHidden*(..) ###

Return a `BinderCollection` with all items hidden.

### *isSelected*(..) ###

Return a `BinderCollection` with all items selected.

### *map*(...) ###

See `Array`.`map`. Returns a `BinderCollection`.

### *slice*(...) ###

See `Array`.`slice`. Returns a `BinderCollection`.

### *splice*(...) ###

See `Array`.`splice`. Returns a `BinderCollection`.

binderx.js
--------------------

**binderx.js** add working examples of how to create base objects to extend. These will probably be needed in any project but **binder.js** don't require them to work.

### `Appender` ###

Allow **update** function to receive an `Array` to append children to object. Each item of the `Array` will be used to execute the child's **update** function.

### `Input` ###

Change the **value** function to interact with the *value* attribute.

### `Prepender` ###

Allow **update** function to receive an `Array` to prepend children to object. Each item of the `Array` will be used to execute the child's **update** function.

### `Updater` ###

Allow **update** function to receive an `Array` to update children's object. Each item of the `Array` will be used to execute the child's **update** function.


Road map 
--------------------

* Documentation and examples
* Re-evaluate group attribute as method 
* Proper implementation of Binder.no
* Improve error handling

Acknowledges
--------------------

The following people were involved in the implementation of **JsBinder** and contribuited to **binder.js**:

* [LuRsT](https://github.com/LuRsT)
* [Shemahmforash](https://github.com/Shemahmforash)
* [andremiguelaa](https://github.com/andremiguelaa)
* [gnribeiro](https://github.com/gnribeiro)
* [goncalo85](https://github.com/goncalo85)
* [mangaru](https://github.com/mangaru)
* [ricardoanjinho](https://github.com/ricardoanjinho)
* [whity](https://github.com/whity)

The [Minified][min] and [Base62][base62] versions, were made using [Dean Eduards Packer][packer].

[base62]:       binder.base62.js
[contextAttr]:  #context
[defaultClass]: #defaultclass
[groupAttr]:    #group
[min]:          binder.min.js
[packer]:       http://dean.edwards.name/packer/ 
