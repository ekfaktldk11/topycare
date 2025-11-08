import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
	name: 'post-confirmation',
	environment: {
		DEFAULT_GROUP: 'USER',
	},
	resourceGroupName: 'auth'
});
