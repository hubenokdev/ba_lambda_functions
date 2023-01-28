import "source-map-support/register";
import {Logger} from "@sailplane/logger";
import {S3Service} from "../aws-services/s3.service";
import {isUndefined} from "lodash";
import {S3Event, S3Handler} from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import {ClaimService} from "./claim.service";
import {Injector} from "@sailplane/injector";

const logger = new Logger("userHandler");

const s3Service = Injector.get(S3Service)!;
const claimService = Injector.get(ClaimService)!;


export const process: S3Handler =
    async (event: S3Event, context) => {

        const records = event.Records;
        if (isUndefined(records)) {
            throw new Error("records not found")
        }

        // loop on s3 event record
        for (const record of records) {

            const bucketName = record.s3.bucket.name;
            const key = record.s3.object.key;

            logger.info(`record: bucket.name ${bucketName}, key ${key} `);

            const s3Param: S3.GetObjectRequest = {
                Bucket: bucketName, Key: key
            }

            const csvFile = await s3Service.getObject(s3Param)
            logger.info(`record: file ${key} ContentLength ${csvFile.ContentLength}`);

            await claimService.putClaimsFromCSVString(csvFile.Body!.toString())

        }

    }

