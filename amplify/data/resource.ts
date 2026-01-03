import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
    UserProfile: a
        .model({
            nickname: a.string(),
            avatarUrl: a.string(),
            feedbacks: a.hasMany("Feedback", "userProfileId"), // UserProfile : Feedback = 1 : N 관계
        })
        .authorization((allow) => [
            allow.owner(),
            allow.publicApiKey().to(["read"]),
        ]),

    Dish: a
        .model({
            img: a.string(),
            name: a.string().required(),
            brand: a.string(),
        })
        .authorization((allow) => [
            // ✅ 비로그인 사용자 읽기 허용 (Identity Pool guest)
            allow.publicApiKey().to(["read"]),
            // ✅ ADMIN 그룹만 쓰기 가능
            allow.group("ADMIN").to(["create", "update", "delete", "read"]),
        ]),

    Feedback: a
        .model({
            itemId: a.string().required(),
            // owner 필드는 allow.owner() 가 자동으로 추가/관리해줌
            itemType: a.string().required(),
            rating: a.integer().required(),
            content: a.string(),
            userProfileId: a.id(), // Foreign Key
            author: a.belongsTo("UserProfile", "userProfileId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["create"]),
            // ✅ 이 레코드의 owner 만 update / delete 가능
            // owner 필드는 자동으로 추가되고 <sub>::<username> 형식으로 저장됨
            allow.owner(),
        ]), // 여기는 Model-level 의 authorization rule

    KnowHow: a
        .model({
            title: a.string().required(),
            content: a.string().required(),
            contentType: a.enum(["markdown", "text"]), // 마크다운 또는 텍스트
            userProfileId: a.id(), // Foreign Key
            author: a.belongsTo("UserProfile", "userProfileId"),
            upvotes: a.hasMany("KnowHowUpvote", "knowHowId"), // KnowHow : KnowHowUpvote = 1 : N 관계
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["create"]),
            allow.owner().to(["update", "delete"]),
        ]),

    KnowHowUpvote: a
        .model({
            knowHowId: a.id().required(), // Foreign Key
            knowHow: a.belongsTo("KnowHow", "knowHowId"),
            userProfileId: a.id(), // Foreign Key
            author: a.belongsTo("UserProfile", "userProfileId"),
        })
        .authorization((allow) => [
            allow.publicApiKey().to(["read"]),
            allow.authenticated().to(["create"]),
            allow.owner().to(["delete"]), // 자신의 upvote만 취소 가능
        ]),
}); // 여기서 authorization 을 설정하는 것을 Global authorization rule 이라 함.

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        // 로그인 사용자 기본은 userPool
        defaultAuthorizationMode: "apiKey",
        apiKeyAuthorizationMode: { expiresInDays: 365 },
    },
});
