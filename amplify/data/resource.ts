import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
	Dish: a
		.model({
			img: a.string(),
			name: a.string().required(),
			brand: a.string(),
		})
		.authorization((allow) => [
			// ✅ 비로그인 사용자 읽기 허용 (Identity Pool guest)
			allow.guest().to(["read"]),
			// ✅ 로그인 사용자도 기본적으로 읽기 허용
			allow.authenticated().to(["read"]),
			// ✅ ADMIN 그룹만 쓰기 가능
			allow.group("ADMIN").to(["create", "update", "delete", "read"]),
		]),

	Feedback: a
		.model({
			itemId: a.string().required(),
			// owner 필드는 allow.owner() 가 자동으로 추가/관리해줌
			// 필요하면 createdAt/updatedAt 은 클라이언트/함수에서 채워도 OK
			itemType: a.string().required(),
			rating: a.integer().required(),
			content: a.string(),
			createdAt: a.datetime().required(),
			updatedAt: a.datetime().required(),
		})
		.authorization((allow) => [
			// ✅ 비로그인 사용자도 모든 Feedback 읽기 가능
			allow.guest().to(["read"]),
			// ✅ 로그인한 아무나 생성 + 읽기 가능
			allow.authenticated().to(["create", "read"]),
			// ✅ 이 레코드의 owner 만 update / delete 가능
			// owner 필드는 자동으로 추가되고 <sub>::<username> 형식으로 저장됨
			allow.owner().to(["update", "delete"]),
		]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		// 로그인 사용자 기본은 userPool
		defaultAuthorizationMode: "userPool",
		// 비로그인 사용자(guest)용 identityPool 도 함께 사용
		//additionalAuthorizationModes: ["identityPool"],
	},
});