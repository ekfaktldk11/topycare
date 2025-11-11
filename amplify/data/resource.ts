import { a, defineData } from "@aws-amplify/backend";
import type { ClientSchema } from "@aws-amplify/backend";

// Define the schema for Feedback and Dish tables
const schema = a.schema({
	Dish: a
		.model({
			img: a.string(),
			name: a.string().required(),
			brand: a.string(),
		})
		.authorization((allow) => [
            allow.guest().to(['read']), // 비로그인 사용자는 읽기만
            allow.authenticated().to(['read']), // 로그인 사용자는 읽기만
            allow.group('admin').to(['create', 'update', 'delete', 'read']), // admin 그룹만 쓰기 가능
        ]),

	Feedback: a
		.model({
			userId: a.string().required(),
			itemType: a.string().required(),
			rating: a.integer().required(),
			content: a.string(),
			createdAt: a.datetime().required(),
			updatedAt: a.datetime().required(),
		})
		.authorization((allow) => [
            allow.guest().to(['read']),
            allow.authenticated().to(['create', 'read']), // 로그인 사용자는 생성 가능
            allow.owner(), // 본인 것만 수정/삭제
        ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'apiKey',
	},
});