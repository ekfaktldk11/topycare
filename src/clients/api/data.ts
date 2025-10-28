import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

// Now you should be able to make CRUDL operations with the
// Data client
export const fetchDishes = async () => {
    const { data: dish, errors } = await client.models.Dish.list();
    //console.log("Fetched dish:", dish, errors);
	return { dish, errors };
};
