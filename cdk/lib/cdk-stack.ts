import * as cdk from 'aws-cdk-lib';
import { CfnOutput, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { RustFunction } from 'cargo-lambda-cdk';
import { Construct } from 'constructs';
import { join } from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new RustFunction(this, 'Axum API', {
      // Path to the http-axum root directory.
      manifestPath: join(__dirname, '..', '..', 'api'),
    });

    if (process.env.ENABLE_LAMBDA_RUST_AXUM_FUNCTION_URL) {
      const lambdaUrl = handler.addFunctionUrl({
        authType: FunctionUrlAuthType.NONE,
      });
      new CfnOutput(this, 'Axum FunctionUrl ', { value: lambdaUrl.url });
    }

    new LambdaRestApi(this, 'axum', { handler });
  }
}