"use strict";

const grpc = require("grpc");
const path = require("path");
const fs = require("fs");
const errorReporting = require('@google-cloud/error-reporting');
const GrpcServer = require("./grpc-server");
const grpcErrors = require("./grpc-errors");
const HealthCheck = require('./healthCheck')

module.exports = {

    /**
     * Starts the grpc server with provided obj properties
     * @param {Object} obj - various properties for the grpc server
     * @param {string} obj.googleProjectName - the google project name (for google-cloud logging)
     * @param {string} obj.binding - binding address
     * @param {number} obj.port - port number
     * @param {Object} obj.grpcOptions - map of grpc options e.g. 'grpc.max_send_message_length', 'grpc.max_receive_message_length
     * @param {Object} obj.httpHeaders - map of http header names and values e.g. { 'cache-control': 'no-cache' }
     * @param {number} obj.protoFilesRootDir - proto files dir path e.g. path.resolve(__dirname, '../proto')
     * @param {string[]} obj.protoFilenames - names of proto files
     * @param {Object} obj.serviceMappings - map of service name to service libs e.g. { HealthCheck: require('./services/healthCheck')}
     * @param {string[]} obj.loggingIgnoreMethods - method names to exclude logging for e.g. ['healthCheck']
     */
    grpcStart: function(obj) {

        // satisfy current grpcOptions object
        if (obj.grpcOptions) {
            obj.grpcOptions.root = obj.protoFilesRootDir
        }


        obj.protoFilenames.push('grpc_server/healthCheck.proto')

        //override health check

        if (obj.healthCheck) {

            obj.serviceMappings['HealthCheck'] = {

                healthCheck: function(request, call) {

                    return obj.healthCheck(request, call).then((result) => {

                            return Promise.resolve(HealthCheck.healthCheck(request, call))

                        })
                        .catch((error) => {
                            let errorMessage = 'An error occurred in the healthCheck';

                            if(error){
                              if(error instanceof Error){
                                errorMessage = error.message;
                              }else{
                                errorMessage = (typeof error === 'object')? JSON.stringify(error) : error;
                              }

                            }

                            server.error(errorMessage)

                            throw new grpcErrors.InternalError(errorMessage);

                        })
                }

            }
        } else {
            obj.serviceMappings['HealthCheck'] = HealthCheck
        }


        //create server
        let server = new GrpcServer(obj.grpcOptions, obj.protoFilenames, obj.serviceMappings);

        //override beforeCall to add http headers and ignore logging for any specific methods
        server.beforeCall = function(call) {

            //cycle through headers and assign
            Object.keys(obj.httpHeaders).forEach(httpHeader => {
                call.headers[httpHeader] = obj.httpHeaders[httpHeader]
            });

            if (!obj.loggingIgnoreMethods || !obj.loggingIgnoreMethods.includes(call.methodName)) {
                console.log(JSON.stringify({
                    method: call.methodName,
                    request: call.request
                }));
            }
        };

        //override error handling

        if (obj.googleProjectName && process.env.ENDPOINT_VERSION) {
            let endpoint = (process.env.ENDPOINT_NAME || '').match(/^([\w_-]+)\.endpoints.([\w_-]+)\.cloud.goog$/);
            let epConfig = {
                projectId: obj.googleProjectName,
                serviceContext: {
                    service: endpoint[1],
                    version: process.env.ENDPOINT_VERSION
                }
            };

            const errors = errorReporting(Object.assign({
                ignoreEnvironmentCheck: true,
                reportUnhandledRejections: true
            }, epConfig));

            server.error = function errorReport(ex) {
                console.error(ex);
                try {
                    if (ex && errors && errors.report)
                        errors.report(ex);
                } catch (ex2) {
                    console.error(ex2);
                }
            }


        } else {
            server.error = function report(ex) {

                console.error(ex)
            }
        }

        //bind and start the server
        server.bind(`${obj.binding}:${obj.port}`, grpc.ServerCredentials.createInsecure());
        server.start();

        console.log(`Server running at ${obj.binding}:${obj.port}`)
    }
}