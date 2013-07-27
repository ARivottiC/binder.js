3.1.4
    * parentNode is not undefined in unattached elements in IE8
    * example now full working in IE8

3.1.3
    * fixed hasOwnProperty call
    * some fixes for IE8

3.1.2
    * using classList for class atributte manipulation
    * template method now returns a clone
    * using forEach on Array like objects to prevent breaking in IE8
    * fixed class called as a method (IE8 reserve word)
    * removed polyfills from example and lib and suggest only waht to polyfill
    * improved the Tree example
    * template manipulations is good enougth
    * clone logic is absolete... for now

3.1.1
    * support for config comments
    * template method added

3.1.0
    * isappender and isprepender removed
    * array value logic removed from update 
    * added binderx.js with:
        * binder.updater
        * binder.appender
        * binder.prepender
        * binder.input
    * binder classes can now be accessed directly as binder.%
    * binder.object removed
    * events now preventdefault and stoppropagation on return false 

3.0.4
    * fixed swap method
    * fixed array methods in BinderCollection
    * code cleanup
    * better exanples

3.0.3
    * minor code improvements
    * documentation milestone II

3.0.2
    * Binder.merge removed
    * on and no are now Class methods
    * removed template logic from update method
    * attach now considers a template name if an elem is not given
    * BinderCollection.exec now handles arguments properly
    * minor code improvements
    * added binder.min.js and binder.base62.js
    * added "Hello World" and "List" examples to docs/index.html
    * more documentation

3.0.1
    * Binder.utils.merge is now Binder.merge
    * BInder.utils.object was divided in two:
        * Binder.object, to get an object
        * Binder.define, to define an object
    * Binder.attr is now Binder.defaultAttr
    * Binder.class is now Binder.defaultClass
    * removed Object.create dependency... for now
    * value method now dettach all children when a value is defined
    * BinderCollection:
        * added exec, isSelected and isHidden methods
        * deselect, select, hide, on and show methods removed
        * map, splice and filter now use slice
    * initial work on proper documentation
    * added/improved jshint options and location
    * improved comments
    * improved var names 

3.0.0
    * first commit
