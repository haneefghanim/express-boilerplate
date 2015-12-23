'use strict';

/**
 * Defining a custom error type for our purposes.
 *
 * @param message
 * @param name
 * @param code
 * @constructor
 */
function AppError(message, name, code) {
    this.message = message;
    this.name = name || 'AppError';
    this.code = code || 400;
    Error.captureStackTrace(this, AppError);
}
AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

exports.AppError = AppError;

exports.AlreadyLoggedIn = function () {
    return new AppError('You\'re already logged in!', 'AlreadyLoggedIn', 400);
};

exports.MissingParameter = function (parameter) {
    var message = parameter ? 'Missing parameter: ' + parameter : 'Missing parameter.';
    return new AppError(message, 'MissingParameter', 400);
};


exports.UserExists = function () {
    return new AppError('A user account already exists for that email address.', 'UserExists', 400);
};

exports.ValidationError = function (message) {
    message = message || 'Validation error.';
    return new AppError(message, 'ValidationError', 400);
};

exports.NotLoggedIn = function () {
    return new AppError('You need to be logged in to perform this action.', 'NotLoggedIn', 400);
};

exports.NotAuthorized = function (message) {
    message = message || 'You are not authorized to perform this action.';
    return new AppError(message, 'NotAuthorized', 403);
};

exports.InvalidParameter = function (parameter, invalidMessage) {
    var message = parameter ? 'Invalid parameter: ' + parameter + '.' : 'Invalid parameter.';
    if (invalidMessage) {
        message = message + ' ' + invalidMessage;
    }

    return new AppError(message, 'InvalidParameter', 400);
};

exports.NotFound = function (message) {
    message = message || 'Not found.';

    return new AppError(message, 'NotFound', 404);
};

exports.Unknown = function (message) {
    message = message || 'Something went wrong.';

    return new AppError(message, 'Unknown', 500);
};

/**
 * Sends error out on the wire via the express response object.
 *
 * @param res
 * @param error
 */
exports.send = function (error, res) {
    var errorObject = {
        error: error.name,
        message: error.message
    };

    // Can send along meta information out with the error.
    if (error.meta) {
        errorObject.meta = error.meta;
    }

    return res.status(error.code).json(errorObject);
};

/**
 * Sends out AppError errors on the wire, and send out Unknown ones if the error
 * is unrecognized, while also logging it.  Used for API routes.
 *
 * @param error
 * @param res
 * @returns {*|ServerResponse}
 */
exports.handle = function (error, res) {
    if (error instanceof AppError) {
        return exports.send(error, res);
    }

    console.log(error.stack);
    return exports.send(exports.Unknown(), res);
};

/**
 * Handles logging & displaying errors to the user, used for UI routes.
 *
 * @param error
 * @param res
 */
exports.display = function (error, res) {
    // TODO need to implement these views

    if (error instanceof AppError) {
        return res.status(404).render('404', {layout: 'app'});
    }

    console.log(error.stack);
    return res.status(500).render('500', {layout: 'app'});
};