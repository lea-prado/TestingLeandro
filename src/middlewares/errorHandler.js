export default (err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Unexpected error'
    });
};
