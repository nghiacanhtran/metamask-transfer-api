export const formatResponse = (data, message = 'Success', statusCode = 200) => {
    return {
        status: statusCode,
        message: message,
        data: data
    };
};

export const handleError = (error, statusCode = 500) => {
    return {
        status: statusCode,
        message: error.message || 'An error occurred',
        data: null
    };
};