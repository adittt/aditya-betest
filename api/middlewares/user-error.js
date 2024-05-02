const AppError = require('../../utils/app-error');

const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}!`
    return new AppError(msg, 400);
}

const duplicateKeyErrorHandler = (err) => {
    const fieldObj = {
        userName: 'username',
        accountNumber: 'account number',
        emailAddress: 'email',
        identityNumber: 'identity number'
    }
    const errField = Object.keys(err.keyValue)[0]
    const msg = `There is already an ${fieldObj[errField]} with that value. Please use another value!`;

    return new AppError(msg, 400);
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val => val.message);
    const errorMessages = errors.join('. ');
    const msg = `Invalid input data, ${errorMessages}`;

    return new AppError(msg, 400);
}

const prodErrors = (res, error) => {

    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong! Please try again later.'
    })

}

module.exports = (error, req, res, next) => {
    
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (error.name === 'CastError') error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === 'ValidationError') error = validationErrorHandler(error);

    prodErrors(res, error);
}