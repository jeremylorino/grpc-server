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

const grpc = require("grpc");

/** HTTP/400 - Client specified an invalid argument. Check error message and error details for more information. */
class InvalidArgumentError extends Error {
    constructor(message, details) {
        super(message || "INVALID_ARGUMENT");
        this.code = grpc.status.INVALID_ARGUMENT;
        this.httpCode = 400;
        this.details = details || ["Client specified an invalid argument."]
    }
}
/** HTTP/400 - Request can not be executed in the current system state, such as deleting a non-empty directory. */
class FailedPreconditionError extends Error {
    constructor(message, details) {
        super(message || "FAILED_PRECONDITION");
        this.code = grpc.status.FAILED_PRECONDITION;
        this.httpCode = 400;
        this.details = details || ["Request can not be executed in the current system state."]
    }
}
/** HTTP/400 - Client specified an invalid range. */
class OutOfRangeError extends Error {
    constructor(message, details) {
        super(message || "OUT_OF_RANGE");
        this.code = grpc.status.OUT_OF_RANGE;
        this.httpCode = 400;
        this.details = details || ["Client specified a value out of range."]
    }
}
/** HTTP/401 - Request not authenticated due to missing, invalid, or expired OAuth token. */
class UnauthenticatedError extends Error {
    constructor(message, details) {
        super(message || "UNAUTHENTICATED");
        this.code = grpc.status.UNAUTHENTICATED;
        this.httpCode = 401;
        this.details = details || ["Request not authenticated due to missing/invalid/expired credentials."]
    }
}
/** HTTP/403 - Client does not have sufficient permission. This can happen because the OAuth token does not have the right scopes, the client doesn't have permission, or the API has not been enabled for the client project. */
class PermissionDeniedError extends Error {
    constructor(message, details) {
        super(message || "PERMISSION_DENIED");
        this.code = grpc.status.PERMISSION_DENIED;
        this.httpCode = 403;
        this.details = details || ["Client does not have sufficient permission."]
    }
}
/** HTTP/404 - A specified resource is not found, or the request is rejected by undisclosed reasons, such as whitelisting. */
class NotFoundError extends Error {
    constructor(message, details) {
        super(message || "NOT_FOUND");
        this.code = grpc.status.NOT_FOUND;
        this.httpCode = 404;
        this.details = details || ["The specified resource requested was not found."]
    }
}
/** HTTP/409 - Concurrency conflict, such as read-modify-write conflict. */
class AbortedError extends Error {
    constructor(message, details) {
        super(message || "ABORTED");
        this.code = grpc.status.ABORTED;
        this.httpCode = 409;
        this.details = details || ["The operation was aborted due to a conflicting change."]
    }
}
/** HTTP/409 - The resource that a client tried to create already exists. */
class AlreadyExistsError extends Error {
    constructor(message, details) {
        super(message || "ALREADY_EXISTS");
        this.code = grpc.status.ALREADY_EXISTS;
        this.httpCode = 409;
        this.details = details || ["The resource that the client tried to create already exists."]
    }
}
/** HTTP/429 - Either out of resource quota or reaching rate limiting. The client should look for google.rpc.QuotaFailure error detail for more information. */
class ResourceExhaustedError extends Error {
    constructor(message, details) {
        super(message || "RESOURCE_EXHAUSTED");
        this.code = grpc.status.RESOURCE_EXHAUSTED;
        this.httpCode = 429;
        this.details = details || ["Exhausted resource quota, please try again."]
    }
}
/** HTTP/499 - Request cancelled by the client. */
class CancelledError extends Error {
    constructor(message, details) {
        super(message || "CANCELLED");
        this.code = grpc.status.CANCELLED;
        this.httpCode = 499;
        this.details = details || ["Request cancelled by the client."]
    }
}
/** HTTP/500 - Unrecoverable data loss or data corruption. The client should report the error to the user. */
class DataLossError extends Error {
    constructor(message, details) {
        super(message || "DATA_LOSS");
        this.code = grpc.status.DATA_LOSS;
        this.httpCode = 500;
        this.details = details || ["Unrecoverable data loss or data corruption."]
    }
}
/** HTTP/500 - Unknown server error. Typically a server bug. */
class UnknownError extends Error {
    constructor(message, details) {
        super(message || "UNKNOWN");
        this.code = grpc.status.UNKNOWN;
        this.httpCode = 500;
        this.details = details || ["Unknown server error."]
    }
}
/** HTTP/500 - Internal server error. Typically a server bug. */
class InternalError extends Error {
    constructor(message, details) {
        super(message || "INTERNAL");
        this.code = grpc.status.INTERNAL;
        this.httpCode = 500;
        this.details = details || ["Internal server error."]
    }
}
/** HTTP/501 - API method not implemented by the server. */
class UnimplementedError extends Error {
    constructor(message, details) {
        super(message || "UNIMPLEMENTED");
        this.code = grpc.status.UNIMPLEMENTED;
        this.httpCode = 501;
        this.details = details || ["API method not implemented by the server."]
    }
}
/** HTTP/503 - Service unavailable. Typically the server is down. */
class UnavailableError extends Error {
    constructor(message, details) {
        super(message || "UNAVAILABLE");
        this.code = grpc.status.UNAVAILABLE;
        this.httpCode = 503;
        this.details = details || ["Service temporarily unavailable."]
    }
}
/** HTTP/504 - Request deadline exceeded. If it happens repeatedly, consider reducing the request complexity. */
class DeadlineExceededError extends Error {
    constructor(message, details) {
        super(message || "DEADLINE_EXCEEDED");
        this.code = grpc.status.DEADLINE_EXCEEDED;
        this.httpCode = 504;
        this.details = details || ["Request deadline exceeded or request too large."]
    }
}

module.exports = {
    /** HTTP/400 - Client specified an invalid argument. Check error message and error details for more information. */
    InvalidArgumentError: InvalidArgumentError,
    /** HTTP/400 - Request can not be executed in the current system state, such as deleting a non-empty directory. */
    FailedPreconditionError: FailedPreconditionError,
    /** HTTP/400 - Client specified an invalid range. */
    OutOfRangeError: OutOfRangeError,
    /** HTTP/401 - Request not authenticated due to missing, invalid, or expired OAuth token. */
    UnauthenticatedError: UnauthenticatedError,
    /** HTTP/403 - Client does not have sufficient permission. This can happen because the OAuth token does not have the right scopes, the client doesn't have permission, or the API has not been enabled for the client project. */
    PermissionDeniedError: PermissionDeniedError,
    /** HTTP/404 - A specified resource is not found, or the request is rejected by undisclosed reasons, such as whitelisting. */
    NotFoundError: NotFoundError,
    /** HTTP/409 - Concurrency conflict, such as read-modify-write conflict. */
    AbortedError: AbortedError,
    /** HTTP/409 - The resource that a client tried to create already exists. */
    AlreadyExistsError: AlreadyExistsError,
    /** HTTP/429 - Either out of resource quota or reaching rate limiting. The client should look for google.rpc.QuotaFailure error detail for more information. */
    ResourceExhaustedError: ResourceExhaustedError,
    /** HTTP/499 - Request cancelled by the client. */
    CancelledError: CancelledError,
    /** HTTP/500 - Unrecoverable data loss or data corruption. The client should report the error to the user. */
    DataLossError: DataLossError,
    /** HTTP/500 - Unknown server error. Typically a server bug. */
    UnknownError: UnknownError,
    /** HTTP/500 - Internal server error. Typically a server bug. */
    InternalError: InternalError,
    /** HTTP/501 - API method not implemented by the server. */
    UnimplementedError: UnimplementedError,
    /** HTTP/503 - Service unavailable. Typically the server is down. */
    UnavailableError: UnavailableError,
    /** HTTP/504 - Request deadline exceeded. If it happens repeatedly, consider reducing the request complexity. */
    DeadlineExceededError: DeadlineExceededError
};
