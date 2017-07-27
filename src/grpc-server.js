"use strict";
/******************************************************************************
 * MIT License
 * Copyright (c) 2017 https://github.com/vroomlabs
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Created by vroomlabs on 7/2/17.
 ******************************************************************************/

const fs = require("fs");
const path = require("path");
const grpc = require("grpc");
const grpcErrors = require("./grpc-errors");

/**
 * Provides a GRPC Service that support promises
 */
class GrpcServer extends grpc.Server {
    /**
     * Constructs a server and optionally loads and registers the services
     * @param root - Path to the root of the proto directory
     * @param protos - One or more proto files to load
     * @param implementationMap - Service Name [unqualified] to implementation object map
     */
    constructor(root, protos, implementationMap) {
        super();

        if (root && protos && implementationMap) {
            let loaded = {};
            if (!Array.isArray(protos)) protos = [protos];
            protos.forEach(file => {
                let proto = null;
                try {
                    if (!fs.existsSync(path.resolve(root, file))) {
                        throw new Error("File not found: " + path.resolve(root, file));
                    }
                    proto = grpc.load({file: file, root: root}, "proto", {convertFieldsToCamelCase:true});
                }
                catch (ex) {
                    let error = new Error(`Unable to load "${file}", reason: ${ex.message}`);
                    error.stack = ex.stack;
                    throw error;
                }
                try {
                    loadServicesMap(proto, loaded);
                }
                catch (ex) {
                    let error = Error(`Unable to locate services in "${file}", reason: ${ex.message}`);
                    error.stack = ex.stack;
                    throw error;
                }
            });

            let names = Object.keys(implementationMap);
            for (let ix=0; ix < names.length; ix++) {
                let name = names[ix];
                if (!loaded[name]) { throw new Error(`unable to locate "${names[ix]}" in any proto.`); }
                this.addService(loaded[name], implementationMap[name]);
            }
        }
    }

    /**
     * Replace this method to pre-process all api calls
     * @param {{request:object,headers:object,methodName:string}} call
     */
    // eslint-disable-next-line no-unused-vars
    beforeCall(call) {
        //let requestHeaders = call.metadata.getMap();
        call.headers["cache-control"] = "no-cache";
    }

    /**
     * Replace this method to post-process all api calls
     * @param {{request:object,headers:object,methodName:string}} call
     * @param {Error} [error]
     * @param {Object} [result]
     */
    // eslint-disable-next-line no-unused-vars
    afterCall(call, error, result) {
        if (error) {
            this.error(error);
        }
    }

    /**
     * Replace this method to handle all errors in the server
     * @param {Error} error
     */
    error(error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    /**
     * Adds a grpc proto service to the server
     * @param {Object} service = results of grpc.load(...)
     * @param {Object} implementation = map from method name to: function(requestObject, call, callback) as Promise|Object
     * @returns {*}
     */
    addService(service, implementation) {
        if (isGrpcService(service)) {
            service = service.service;
        }
        return grpc.Server.prototype.addService.apply(this, [service, grpcCall(this, implementation)]);
    }

    /** @deprecated Use addService instead. */
    addProtoService(svc, impl) { return this.addService(svc, impl); }
}

/**
 * Crawls the object and finds the services exported
 */
function loadServicesMap(obj, output) {
    let keys = Object.keys(obj);
    for (let ix=0; ix < keys.length; ix++) {
        let child = obj[keys[ix]];
        if (isGrpcService(child)) {
            output[keys[ix]] = child;
        }
        else {
            loadServicesMap(child, output);
        }
    }
}

/**
 * @returns {boolean} true if the object provided is an rpc service
 */
function isGrpcService(service) {
    return !!(service && service.service && service.prototype && service.prototype.constructor &&
    service.prototype.constructor.name === "ServiceClient");
}

/**
 * Allow Promise or immediate return, as well as callback
 * @param {GrpcServer} server
 * @param obj
 * @returns {*}
 */
function grpcCall(server, obj) {
    let mapped = Object.assign({}, obj);
    Object.keys(obj).forEach(key => { mapped[key] = grpcMethod(server, mapped[key], key); });
    return mapped;
}

/**
 * defines call.headers and uses method sig
 * @param {GrpcServer} server
 * @param {function} func Promise|Object function(requestObject, call, callback)
 * @param {string} name - name of the member
 * @returns {Function} function(call, callback) signature
 */
function grpcMethod(server, func, name) {
    return function(call, complete) {
        call.methodName = name;
        call.headers = {};

        const callback = function(e, arg) {
            try {
                server.afterCall(call, e, arg);
            }
            catch(ex) { server.error(ex); }

            try {
                let metadata = new grpc.Metadata();
                Object.keys(call.headers).forEach(k => {
                    if (typeof call.headers[k] === "string") metadata.set(k, call.headers[k]);
                });
                call.sendMetadata(metadata);
            }
            catch(ex) { server.error(ex); }

            // If not a grpc-error, go ahead and make one.
            if (e && (!e.constructor || !e.constructor.name || !grpcErrors.hasOwnProperty(e.constructor.name))) {
                let grpcError = new grpcErrors.UnknownError(e.message);
                ["columnNumber", "fileName", "lineNumber", "name", "stack"]
                    .forEach(fld => { if (e.hasOwnProperty(fld)) grpcError[fld] = e[fld]; });
                e = grpcError;
            }
            try {
                complete(e, arg);
            }
            catch (ex) { server.error(ex); }
        };

        try {
            server.beforeCall(call);

            let result = func(call.request, call, callback);
            if (typeof result.then === "function") {
                result.then(result => callback(null, result))
                    .catch(error => callback(error));
            }
            else if (result) {
                callback(null, result);
            }
        }
        catch (ex) {
            callback(ex);
        }
    }
}

module.exports = GrpcServer;
