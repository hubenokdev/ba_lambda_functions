import {HttpError} from "http-errors";
import {Logger} from "@sailplane/logger";
import {Injector} from "@sailplane/injector";

const logger = new Logger("HttpErrorHelper");

export class HttpErrorUtil {
    newHttpErrorResponse(error: Error) {
        logger.error(JSON.stringify(error));
        logger.error(JSON.stringify(error.stack));
        const statusCode = (error as HttpError).statusCode || 500;
        const body = JSON.stringify({
            error: {
                message: (error as HttpError).message,
                name: error.name,
            },
        });
        return {
            statusCode,
            body,
        };
    }

    httpError(errorMessage: string, statusCode: number = 500) {
        logger.error(errorMessage);
        const body = JSON.stringify({
            error: {
                message: errorMessage
            },
        });
        return {
            statusCode,
            body,
        };
    }
}

Injector.register(HttpErrorUtil);
