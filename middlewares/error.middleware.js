const errorMiddleware = (err, req, res, next) => {
    try {
        console.error(err.stack);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message || 'An unexpected error occurred'
        });
    } catch (error) {
        console.error('Error in error middleware:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: 'An unexpected error occurred in the error middleware'
        });
    }
};
export default errorMiddleware;
