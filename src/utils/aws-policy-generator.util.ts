// AWS Policy Generator creates the proper access to the function.
/// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html#api-gateway-lambda-authorizer-lambda-function-create
const POLICY_VERSION = "2012-10-17";
const API_INVOKE = "execute-api:Invoke";

export class AwsPolicyGeneratorUtil {
  static generateAuthResponse(effect: string, methodArn: string) {
    const policyDocument = this.generatePolicyDocument(effect, methodArn);

    return {
      policyDocument,
    };
  }

  static generatePolicyDocument(effect: string, methodArn: string) {
    if (!effect || !methodArn) return null;

    return {
      Version: POLICY_VERSION,
      Statement: [
        {
          Action: API_INVOKE,
          Effect: effect,
          Resource: methodArn,
        },
      ],
    };
  }
}
