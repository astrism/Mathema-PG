Class.Mutators.ClassMethods = function( methods ){
   this.__classMethods = Object.append( this.__classMethods || {}, methods );
   this.extend( methods );
};

Class.Mutators.Extends = function( parent ){
   this.parent = parent;
   parent.$prototyping = true;
   var prototype = this.prototype = new parent();
   delete parent.$prototyping;

   this.implement( 'parent', function(){
      var name, previous;

      name = this.caller._name;
      previous = this.caller._owner.parent.prototype[ name ];

      if ( ! previous ){
         throw new Error( 'The method"' + name + '" has no parent.' );
      }

      return previous.apply( this, arguments );
   });

   this.implement('supa', function() {
      return prototype;
   });

   this.extend( parent.__classMethods );
};