'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise() {
   this.state='pending';
   this.handlerGroups=[];
   this.callHandlers=function(data) {
      console.log(this.handlerGroups[0])
      if (this.state=='resolved' && typeof this.handlerGroups[0].successCb=='function' && this.handlerGroups.length>0)
         this.handlerGroups.shift().successCb(data);
      else if (this.state=='rejected' && typeof this.handlerGroups[0].errorCb=='function')
         this.handlerGroups.shift().errorCb(data);
      }     
   this.then=function(success,fail) {
      // if (typeof success == 'function' && typeof fail == 'function')
      //    this.handlerGroups.push({successCb: success, errorCb: fail});
      if (typeof success != 'function' && typeof fail != 'function')
         this.handlerGroups.push({successCb: null, errorCb: null});
      else
         this.handlerGroups.push({successCb: success, errorCb: null});
      // else if (typeof fail == 'function')
      //    this.handlerGroups.push({successCb: null, errorCb: fail});

      if (this.state='resolved')
         this.callHandlers(this.value);
   };

}

//$Promise.prototype.

// $Promise.prototype.

function Deferral() {
   this.$promise=new $Promise();
}

Deferral.prototype.resolve = function(data) {
      if (this.$promise.state=='pending')  {
      this.$promise.state='resolved';
      this.$promise.value=data;
      if (this.$promise.handlerGroups.length>0) {
      for (var x=0;x<this.$promise.handlerGroups.length;x++)
         this.$promise.callHandlers(data);
      }
   }
   }

Deferral.prototype.reject = function(reason) {
   if (this.$promise.state=='pending')  {
   this.$promise.state='rejected';
   this.$promise.value=reason;
   }
}

function defer() {
   return new Deferral();
};



/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
