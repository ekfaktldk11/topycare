import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
	CognitoIdentityProviderClient,
	AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

export const handler: PostConfirmationTriggerHandler = async (event) => {
	// 1) 모두 기본 USER 그룹에 추가
	await client.send(new AdminAddUserToGroupCommand({
		GroupName: 'USER',
		Username: event.userName,
		UserPoolId: event.userPoolId
	}));

	return event;
};
