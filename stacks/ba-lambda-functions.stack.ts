import {StackContext, Function, Api, Bucket, use} from "@serverless-stack/resources";
import * as iam from "aws-cdk-lib/aws-iam";
import {AuthStack} from "./auth.stack";


export function BaLambdaFunctionsStack({app, stack}: StackContext) {
    const functionNamePrefix = `${app.stage}-${app.name}-`;

    const {authFunction} = use(AuthStack);


    const bucket = new Bucket(stack, "ba-bucket", {});

    bucket.addNotifications(stack, {
            csvFileProcessor: {
                function: {
                    handler: "claim/claims-csv-processor-lambda.ts.process",
                    environment: {
                        MONGODB_URI: process.env.MONGODB_URI!,
                    },
                    bind: [bucket],
                },
                events: ["object_created"],
                filters: [{prefix: process.env.FILE_PATH}, {suffix: ".csv"}],
            },
        }
    )


    const api = new Api(stack, "ba", {
        authorizers: {
            apiKeyAuthorizer: {
                type: "lambda",
                function: authFunction,
                resultsCacheTtl: "30 seconds",
            },
        },
        defaults: {
            function: {
                environment: {
                    LOG_LEVEL: "debug"
                }
            },
        },
        routes: {
            "POST /upload-file": {
                // authorizer: "apiKeyAuthorizer",
                function: {
                    handler: "functions/file-uploader-lambda.upload",
                    functionName: functionNamePrefix + "uploadCsvFile",
                    permissions: [
                        new iam.PolicyStatement({
                            effect: iam.Effect.ALLOW,
                            actions: ["s3:PutObject"],
                            resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
                        }),
                    ],
                    environment: {
                        BUCKET_NAME: bucket.bucketName,
                        CSV_FILE_PATH: process.env.FILE_PATH!
                    }
                },
            },
            "GET /claim/{index}": {
                function: {
                    handler: "claim/get-claim-lambda.get",
                    functionName: functionNamePrefix + "getClaim1",
                    environment: {
                        MONGODB_URI: process.env.MONGODB_URI!,
                    }
                },
            }
        }
    });


    stack.addOutputs({
        ApiEndpoint: api.url,
        ApiRoutes: api.routes.toString(),
    });
}
