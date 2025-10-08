// amplify/storage/resource.ts
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
	name: "topycare-bucket",
	access: (allow) => ({
		"public/*": [allow.guest.to(["read"]), allow.authenticated.to(["read", "write"])],
		"protected/*": [allow.authenticated.to(["read", "write"])],
	}),
});
