import winston, { format } from "winston";

const logger = winston.createLogger({
    transports: [new winston.transports.Console({
        level: 'info',
        handleExceptions: true,
        json: false,
        colorize: true
    })],
    exitOnError: false
});


const log = (context, message, scope) => {
    const dateNow = new Date();
    const jakartaOffset = 7 * 60 * 60 * 1000; // Jakarta is UTC+7, so 7 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const jakartaTime = new Date(dateNow.getTime() + jakartaOffset);
    const formattedTimestamp = jakartaTime.toISOString().replace('Z', '+07:00');
    const obj = {
        timestamp: formattedTimestamp,
        context,
        scope,
        message: message
    };

    logger.info(obj);
};

export default { log };