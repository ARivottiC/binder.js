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
