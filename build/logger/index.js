import pino from 'pino';
//import { Logger } from "tslog";
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        }
    }
});
//const logger: Logger = new Logger();
export default logger;
//# sourceMappingURL=index.js.map