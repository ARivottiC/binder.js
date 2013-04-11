binder.js
====================

Bind Javascript objects to HTML Elements.

Background
--------------------

**binder.js** is a fork of **JsBinder**, a lib used by Sonaecom's PD-Portal Team, in projects like www.saphety.pt, www.clix.pt, www.optimusdiscos.pt and several [Clix TV](http://fibra.clix.pt//tv/) services. Since is a natural evolution from **JsBinder** v2, the first release of **binder.js** have the version 3.0.0..

**binder.js** were develop with the folowwing goals:

* use only standards and pure javascript
* small, clean and simple
* total independence between Javascript and HTML
* objects can be reused and extended in an easy way
* easy integration with other Javascript libs

Requires
--------------------

**binder.js** assumes that your browser implements ECMAScript 5 and **`addEventListener`**. In order to use **binder.js** in browsers that don't meet any of this requirements, we suggest the use of the following polyfills:

* [augment.js](https://github.com/olivernn/augment.js][augment.js) (or any other that implements ECMAScript 5 specification)
* [EventListener.js](https://github.com/jonathantneal/EventListener) (or any other that add the same functionality)

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

Class Methods
--------------------

### *define*(`name`, `extend`[, `implement`, ...], `override`) ###

TODO

### *no*(`object`, `event`, `function`) ###

TODO

### *object*(`name`) ###

TODO

### *on*(`object`, `event`, `function`) ###

TODO

Class Attributes
--------------------

### *defaultAttr* ###

TODO

### *defaultClass* ###

TODO

Object Methods
--------------------

### *attach*(`elem`|`template`[, `args`]) ###

TODO

### *children*([`filter`]) ###

TODO

### *destructor*() ###

TODO

### *dettach*([`child`]) ###

TODO

### *deselect*() ###

TODO

### *isHidden*() ###

TODO

### *isSelected*() ###

TODO

### *hide*() ###

TODO

### *next*() ###

TODO

### *prev*() ###

TODO

### *select*() ###

TODO

### *show*() ###

TODO

### *swap*(`sibling`) ###

TODO

### *update*(`value`) ###

TODO

### *value*(`value`) ###

TODO

Road map 
--------------------

* Documentation and examples
* Re-evaluate isAppender, isPrepender and isUpdater logic
* Proper implementation of Binder.no
* Improve template manipulation
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

[binder.min.js](binder.min.js) and [binder.base62.min](binder.base62.min) were made using [Dean Eduards Packer](http://dean.edwards.name/packer/).
