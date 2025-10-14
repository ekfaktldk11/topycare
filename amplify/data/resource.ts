import { a, defineData } from "@aws-amplify/backend";
import type { ClientSchema } from "@aws-amplify/backend";

// Define the schema for Feedback and Dish tables
const schema = a.schema({
	Dish: a
		.model({
			id: a.id().required(),
			img: a.string(),
			name: a.string(),
			brand: a.string(),
			affect: a.float(),
		})
		.identifier(['id'])
		.authorization((allow) => [allow.guest(), allow.publicApiKey()]),

	Feedback: a
		.model({
			itemId: a.string().required(),
			userId: a.string().required(),
			itemType: a.string().required(),
			rating: a.integer(),
			content: a.string(),
			createdAt: a.datetime(),
			updatedAt: a.datetime(),
		})
		.identifier(['itemId', 'userId', 'itemType'])
		.authorization((allow) => [allow.guest(), allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'apiKey',
	},
});