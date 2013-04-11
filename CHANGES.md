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
