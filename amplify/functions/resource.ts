import { defineFunction } from "@aws-amplify/backend";

export const dishHandler = defineFunction({
	name: "dishHandler",
	entry: "./dish/index.ts",
	timeoutSeconds: 60,
	runtime: 22, // Node.js 22.x
	environment: {
		NODE_ENV: "development",
	},
});
