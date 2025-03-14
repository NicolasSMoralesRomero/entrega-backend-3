export const errorHandler = (error, req, res, next) => {
    if (error.code) {
        // Error personalizado
        req.logger.error(`${error.name}: \nDetalle: ${error.cause}`);
        res.setHeader('Content-Type', 'application/json');
        return res.status(error.code).json({
            error: `Internal server error (custom)`,
            message: process.env.DEBUG ? error.message : undefined
        });
    } else {
        // Error genérico
        req.logger.error(`Error handler activado: ${error.message}`);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: `Internal server error (genérico)`
        });
    }
};