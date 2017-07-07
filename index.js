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

const GrpcServer = require("./src/grpc-server");
const GrpcErrors = require("./src/grpc-errors");

module.exports = {
    GrpcServer: GrpcServer,
    /** HTTP/400 - Client specified an invalid argument. Check error message and error details for more information. */
    InvalidArgumentError: GrpcErrors.InvalidArgumentError,
    /** HTTP/400 - Request can not be executed in the current system state, such as deleting a non-empty directory. */
    FailedPreconditionError: GrpcErrors.FailedPreconditionError,
    /** HTTP/400 - Client specified an invalid range. */
    OutOfRangeError: GrpcErrors.OutOfRangeError,
    /** HTTP/401 - Request not authenticated due to missing, invalid, or expired OAuth token. */
    UnauthenticatedError: GrpcErrors.UnauthenticatedError,
    /** HTTP/403 - Client does not have sufficient permission. This can happen because the OAuth token does not have the right scopes, the client doesn't have permission, or the API has not been enabled for the client project. */
    PermissionDeniedError: GrpcErrors.PermissionDeniedError,
    /** HTTP/404 - A specified resource is not found, or the request is rejected by undisclosed reasons, such as whitelisting. */
    NotFoundError: GrpcErrors.NotFoundError,
    /** HTTP/409 - Concurrency conflict, such as read-modify-write conflict. */
    AbortedError: GrpcErrors.AbortedError,
    /** HTTP/409 - The resource that a client tried to create already exists. */
    AlreadyExistsError: GrpcErrors.AlreadyExistsError,
    /** HTTP/429 - Either out of resource quota or reaching rate limiting. The client should look for google.rpc.QuotaFailure error detail for more information. */
    ResourceExhaustedError: GrpcErrors.ResourceExhaustedError,
    /** HTTP/499 - Request cancelled by the client. */
    CancelledError: GrpcErrors.CancelledError,
    /** HTTP/500 - Unrecoverable data loss or data corruption. The client should report the error to the user. */
    DataLossError: GrpcErrors.DataLossError,
    /** HTTP/500 - Unknown server error. Typically a server bug. */
    UnknownError: GrpcErrors.UnknownError,
    /** HTTP/500 - Internal server error. Typically a server bug. */
    InternalError: GrpcErrors.InternalError,
    /** HTTP/501 - API method not implemented by the server. */
    UnimplementedError: GrpcErrors.UnimplementedError,
    /** HTTP/503 - Service unavailable. Typically the server is down. */
    UnavailableError: GrpcErrors.UnavailableError,
    /** HTTP/504 - Request deadline exceeded. If it happens repeatedly, consider reducing the request complexity. */
    DeadlineExceededError: GrpcErrors.DeadlineExceededError
};
