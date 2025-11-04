import { a, defineData } from "@aws-amplify/backend";
import type { ClientSchema } from "@aws-amplify/backend";

// Define the schema for Feedback and Dish tables
const schema = a.schema({
	Dish: a
		.model({
			id: a.id().required(),
			img: a.string(),
			name: a.string().required(),
			brand: a.string(),
		})
		.identifier(['id'])
		.authorization((allow) => [allow.guest(), allow.publicApiKey()]),

	Feedback: a
		.model({
			itemId: a.string().required(),
			userId: a.string().required(),
			itemType: a.string().required(),
			rating: a.integer().required(),
			content: a.string(),
			createdAt: a.datetime().required(),
			updatedAt: a.datetime().required(),
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