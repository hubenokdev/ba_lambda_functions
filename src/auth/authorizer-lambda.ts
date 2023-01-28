import {Context} from "aws-lambda";
import {
    APIGatewayAuthorizerResultContext,
    APIGatewayEventDefaultAuthorizerContext,
} from "aws-lambda/common/api-gateway";
import "source-map-support/register";
import {Logger} from "@sailplane/logger";
import * as jwt from "jsonwebtoken";
import {AwsPolicyGeneratorUtil} from "../utils/aws-policy-generator.util";

const logger = new Logger("authorizer");
const BASE64 = "base64";
const API_KEY = process.env.API_KEY!;

enum policyStatementEffect {
    ALLOW = "Allow",
    DENY = "Deny",
}

export const handler = async function (
    event: APIGatewayEventDefaultAuthorizerContext,
    context: Context,
    callback: any
): Promise<APIGatewayAuthorizerResultContext> {
    logger.debug("event: ", event);
    logger.debug("context: ", context);
    const apiKey = event!.headers.apiKey
    const methodArn = event!.methodArn;

    if (!apiKey || !methodArn) {
        return callback("Unauthorized");
    }

    try {
        if (apiKey != API_KEY) {
            return callback(
                null,
                AwsPolicyGeneratorUtil.generateAuthResponse(
                    policyStatementEffect.ALLOW,
                    methodArn
                ) as APIGatewayAuthorizerResultContext
            );
        } else {
            return callback(
                null,
                AwsPolicyGeneratorUtil.generateAuthResponse(
                    policyStatementEffect.DENY,
                    methodArn
                ) as APIGatewayAuthorizerResultContext
            );
        }
    } catch (error) {
        logger.error("error", JSON.stringify(error));
        return callback("Unauthorized");
    }
};
