import "source-map-support/register";
import {Logger} from "@sailplane/logger";
import {ClaimService} from "./claim.service";
import {Injector} from "@sailplane/injector";
import * as LambdaUtils from "@sailplane/lambda-utils";
import {HttpErrorUtil} from "../utils/http-error.util";
import {assertIsDefined} from "../utils/assertion.util";


const logger = new Logger("userHandler");

const claimService = Injector.get(ClaimService)!;
const httpError = Injector.get(HttpErrorUtil)!;


export const get = LambdaUtils.wrapApiHandlerV2(
    async (event: LambdaUtils.APIGatewayProxyEventV2) => {
        logger.info(`getClaim index: ${event.pathParameters.index}`);

        try {
            const index = event.pathParameters.index;
            assertIsDefined(index, 'index', 400);

            const claim = await claimService.getClaim(index);

            logger.info(`response:${claim}`)

            return claim;
        } catch (error) {
            return httpError.newHttpErrorResponse(error as Error);
        }
    }
);
