// amplify/storage/resource.ts
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: "topycare-bucket",
    access: (allow) => ({
        "public/*": [
            allow.guest.to(["read"]),
            allow.groups(["ADMIN"]).to(["read", "write", "delete"])
        ],
        "protected/*": [
            allow.groups(["ADMIN"]).to(["read", "write", "delete"])
        ],
    }),
});