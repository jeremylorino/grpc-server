'use strict';
/**
 * Created by rogerk on 6/30/17.
 */

 const FailedPreconditionError = require('./grpc-server').FailedPreconditionError;

 const apiVersion = process.env.ENDPOINT_VERSION;
 let isUnhealthy = false;

 module.exports = {

    setUnhealthy: function() {
      isUnhealthy = true;
    },

    healthCheck: function(request, call) {
      if (isUnhealthy){
           throw new FailedPreconditionError();
       }

      if (request.isReady) {
          // Entered if is kube readiness probe
          // https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-liveness-or-readiness-
      }

       return {
          alive: true,
          uptime: process.uptime(),
          version: process.env.npm_package_version,
          details: {
              nodeVersion : process.env.npm_config_node_version,
              package: process.env.npm_package_name,
              //Add any details needed

          }
      };
    }

 }
