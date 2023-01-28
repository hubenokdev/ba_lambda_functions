import {StackContext, Function} from "@serverless-stack/resources";

export function AuthStack({app, stack}: StackContext) {
    const functionNamePrefix = `${app.stage}-${app.name}-`;

    const authFunction = new Function(stack, "Auth", {
        handler: "auth/authorizer-lambda.handler",
        functionName: functionNamePrefix + "authorizer",
        environment: {
            API_KEY: process.env.API_KEY!,
            LOG_LEVEL: "debug",
        }
    });

    stack.addOutputs({
        AuthFunctionName: authFunction.functionName,
        AuthFunctionArn: authFunction.functionArn,
    });
    return {authFunction};
}
