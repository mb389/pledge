'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise() {
   this.state='pending';
   this.handlerGroups=[];
   this.updateCbs=[];
   this.then=function(success,fail,update) {

      if (update && typeof update == 'function') this.updateCbs.push(update);

      if (typeof success == 'function' && typeof fail == 'function')
         this.handlerGroups.push({successCb: success, errorCb: fail, forwarder: defer() });
      else if (typeof success != 'function' && typeof fail != 'function') {
         this.handlerGroups.push({successCb: null, errorCb: null, forwarder: defer() });
         return this.handlerGroups[0].forwarder.$promise;
      }
      else if (typeof success == 'function')
         this.handlerGroups.push({successCb: success, errorCb: null, forwarder: defer() });
      else if (typeof fail == 'function')
         this.handlerGroups.push({successCb: null, errorCb: fail, forwarder: defer() });

         this.callHandlers(this.value);
         //return this.handlerGroups[0].forwarder.$promise;
   }
   this.catch=function(errorFn) {
      this.then(null,errorFn);
   }
}

$Promise.prototype.callHandlers=function(data) {
   if (this.state=='resolved' && typeof this.handlerGroups[0].successCb=='function' && this.handlerGroups.length>0)
      this.handlerGroups.shift().successCb(data);
   else if (this.state=='rejected' && typeof this.handlerGroups[0].errorCb=='function')
      this.handlerGroups.shift().errorCb(data);

   }

function Deferral() {
   this.$promise=new $Promise();
}

Deferral.prototype.resolve = function(data) {
      if (this.$promise.state=='pending')  {
         this.$promise.state='resolved';
         this.$promise.value=data;
         if (this.$promise.handlerGroups.length>0) {
            for (var x=0;x<this.$promise.handlerGroups.length;x++) {
            if (typeof this.$promise.handlerGroups[x].successCb == 'function') {
               this.$promise.handlerGroups[x].successCb(data);
            //  this.$promise.handlerGroups[x].forwarder.resolve(this.$promise.handlerGroups[x].successCb(data));
            }
            else
               this.$promise.handlerGroups[x].forwarder.resolve(data);
         }
         this.$promise.handlerGroups=[];
      }
   }
}

Deferral.prototype.reject = function(reason) {
   if (this.$promise.state=='pending')  {
      this.$promise.state='rejected';
      this.$promise.value=reason;
      if (this.$promise.handlerGroups.length>0) {
         for (var x=0;x<this.$promise.handlerGroups.length;x++) {
            if (typeof this.$promise.handlerGroups[x].errorCb == 'function')
               this.$promise.handlerGroups[x].errorCb(reason);
            else
               this.$promise.handlerGroups[x].forwarder.reject(reason);
         }
      }
   }
}

Deferral.prototype.notify = function(x) {

   for (var y=0;y<this.$promise.updateCbs.length;y++) {
         if (this.$promise.state=='pending')
      this.$promise.updateCbs[y](x);
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
