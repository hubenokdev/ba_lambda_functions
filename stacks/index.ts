import {App} from "@serverless-stack/resources";
import {RemovalPolicy} from "aws-cdk-lib";
import {BaLambdaFunctionsStack} from "./ba-lambda-functions.stack";
import {AuthStack} from "./auth.stack";


export default function (app: App) {
    app.setDefaultFunctionProps({
        runtime: "nodejs16.x",
        logRetention: "one_month",
        srcPath: "src",
        memorySize: 256,
        tracing: "disabled", // x-ray
        bundle: {
            sourcemap: true,
            format: "esm",
        },
    });

    const durableStages = ["beta", "qa", "staging", "preprod", "prod"];
    const isEphemeralStage = !durableStages.includes(app.stage);
    if (isEphemeralStage) {
        app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    }
    app.stack(AuthStack)
    app.stack(BaLambdaFunctionsStack);


}
