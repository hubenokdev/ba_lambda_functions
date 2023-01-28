import S3, {GetObjectRequest} from "aws-sdk/clients/s3";
import { Injector } from "@sailplane/injector";
import { Logger } from "@sailplane/logger";

const logger = new Logger("S3Service");

export class S3Service {
  private readonly s3Client = new S3();

  async uploadToS3(params: S3.PutObjectRequest) {
    logger.info("upload to S3:", JSON.stringify(`${params.Bucket} ${params.Key}`, null, 2));

    return await this.s3Client.upload(params).promise();
  }

  async getObject(params: S3.GetObjectRequest) {
    logger.info("getFile to S3:", JSON.stringify(`${params.Bucket} ${params.Key}`, null, 2));

    return await this.s3Client.getObject(params).promise();
  }
}

Injector.register(S3Service);
