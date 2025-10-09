import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
	AuthorizationType,
	CognitoUserPoolsAuthorizer,
	Cors,
	LambdaIntegration,
	RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { dishHandler } from "./functions/resource";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
	auth,
	data,
	dishHandler,
});

// create a new API stack
const apiStack = backend.createStack("api-stack");

// create a new REST API
const dishServiceApi = new RestApi(apiStack, "RestApi", { // 얘는 리네이밍할 필요가 있을 수 있음. dish path 에 만 사용되는게 아니니까, 여러 path 이 하나의 api 에 정의할 거라, 범용성 좋은 걸로
	restApiName: "dishService",
	deploy: true,
	deployOptions: {
		stageName: "dev",
	},
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
		allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
		allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
	},
});

// create a new Lambda integration
const lambdaIntegration = new LambdaIntegration(
	backend.dishHandler.resources.lambda,
);

// create a new resource path
const dishesPath = dishServiceApi.root.addResource("dish");

// add methods you would like to create to the resource path
dishesPath.addMethod("GET", lambdaIntegration);
// dishesPath.addMethod("POST", lambdaIntegration);
// dishesPath.addMethod("DELETE", lambdaIntegration);
// dishesPath.addMethod("PUT", lambdaIntegration);

/* auth 가 필요한 경우는 다음 처럼 coginto 권한 요구를 추가할 수 있음. */
// create a new Cognito User Pools authorizer
// const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
// 	cognitoUserPools: [backend.auth.resources.userPool],
// });

// // create a new resource path with Cognito authorization
// dishesPath.addMethod("POST", lambdaIntegration, {
// 	authorizationType: AuthorizationType.COGNITO, // default is AuthorizationType.NONE
// 	authorizer: cognitoAuth,
// });

// add a proxy resource path to the API
dishesPath.addProxy({
	anyMethod: true,
	defaultIntegration: lambdaIntegration,
});

// create a new IAM policy to allow Invoke access to the API : 이건 앱자체 호출에서 필요한 람다 함수 호출 권한인 듯
const apiRestPolicy = new Policy(apiStack, "RestApiPolicy", {
	statements: [
		new PolicyStatement({
			actions: ["execute-api:Invoke"],
			resources: [
				`${dishServiceApi.arnForExecuteApi("*", "/dish", "dev")}`,
				`${dishServiceApi.arnForExecuteApi("*", "/dish/*", "dev")}`,
			],
		}),
	],
});

// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
	apiRestPolicy
);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
	apiRestPolicy
);

// add outputs to the configuration file
backend.addOutput({
	custom: {
		API: {
			[dishServiceApi.restApiName]: {
				endpoint: `${dishServiceApi.url + dishesPath.path}`,
				region: Stack.of(dishServiceApi).region,
				apiName: dishServiceApi.restApiName,
			},
		},
	},
});

/**
 * amplify gen2 에서 람다 함수를 추가하는 과정
 * 1. amplify/functions/resource.ts 에서 람다 함수 정의
 * 2. amplify/backend.ts 에서 람다 함수를 API Gateway와 연결.
 *   - (1). create a new API stack (이미 있다면 추가 필요 없는 듯)
 *   - (2). create a new REST API (같은 api 쓸거고, 다른 메서드에 다른 람다함수 통합시킬 거면 추가 필요 없는 듯)
 *   - (3). create a new Lambda integration - 람다 통합 리소스 생성하고
 *   - (4). create a new resource path
 *   - (5). add methods with Lambda integration - (4)에서 생성한 path 에 (3) 에서 생성한 람다통합과 연결
 * 		- 여기서 호출 권한으로 AuthorizationType.COGNITO, IAM, NONE 다양하게 호출가능
 * 		- IAM : 서버 <-> aws 리소스 인 경우 일듯
 * 		- COGNITO : 클라단에서 유저들의 권한을 다루는 경우 일듯
 *   - (6). add a proxy resource path to the API - (2) 와 (3) 연결 해서 (3) 의 프록시로 (2) 를 타도록
 * 3. add outputs to the configuration file
 *   - 여기서 outputs 을 잘 작성해줘야, gen2 가 amplify_outputs.json 를 올바르게 생성하고, 이 outputs 으로 클라단에서 import 하여 리소스를 잘 사용할 수 있게된다.
 */