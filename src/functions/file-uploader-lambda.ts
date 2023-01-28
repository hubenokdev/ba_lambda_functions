import "source-map-support/register";
import {Injector} from "@sailplane/injector";
import {Logger} from "@sailplane/logger";
import * as LambdaUtils from "@sailplane/lambda-utils";
import {HttpErrorUtil} from "../utils/http-error.util";
import {S3Service} from "../aws-services/s3.service";
import {assertIsDefined} from "../utils/assertion.util";

const logger = new Logger("userHandler");
const httpError = Injector.get(HttpErrorUtil)!;
const s3Service = Injector.get(S3Service)!

const CSV_FILE_PATH = process.env.CSV_FILE_PATH!
const BUCKET_NAME = process.env.BUCKET_NAME!

export const upload = LambdaUtils.wrapApiHandlerV2(
    async (event: LambdaUtils.APIGatewayProxyEventV2) => {

        const payload = event.body;
        logger.info(`uploadFunction: payload ${payload}`);

        try {
            assertIsDefined(payload,'payload',400)

            const fileName = new Date().valueOf() + '.csv'
            const s3Data = {
                Bucket: BUCKET_NAME,
                Key: `${CSV_FILE_PATH}/${fileName}`,
                Body: payload,
                ContentType: "application/csv; charset=utf-8",
            };
            await s3Service.uploadToS3(s3Data)

        } catch (error) {
            return httpError.newHttpErrorResponse(error as Error);
        }
    }
);
