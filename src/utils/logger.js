import winston from "winston"

// Configuración formato logs
export const logger = winston.createLogger({
    level: 'info', // Nivel minimo de loggin
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.colorize({
            colors: {info: "green", warning:"yellow" , error: "red"} 
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error'}), // Logs de errores
        new winston.transports.File({ filename: 'logs/combined.log' }) // Logs combinados
    ]
})

// Middleware para añadir el Logger al objeto req
export const AddLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`Request method: ${req.method}, URL: ${req.url}`)
    next()
}