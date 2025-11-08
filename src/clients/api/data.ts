import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export type DishCreateResult = {
    newDish: Schema["Dish"]["type"] | null;
    errors: any[] | undefined;
};

/**
 * 새로운 Dish를 생성합니다.
 */
export const createDish = async (
    img: string,
    name: string,
    brand: string
): Promise<DishCreateResult> => {
    try {
        const { data: newDish, errors } = await client.models.Dish.create({
            img: img,
            name: name,
            brand: brand,
        });

        if (errors) {
            console.error("Error creating dish:", errors);
        }

        return { newDish, errors };
    } catch (error) {
        console.error(
            "An unexpected error occurred while creating dish:",
            error
        );
        return { newDish: null, errors: [error as any] };
    }
};

export const fetchDishes = async () => {
    const { data: dish, errors } = await client.models.Dish.list();
    //console.log("Fetched dish:", dish, errors);
    return { dish, errors };
};

export type FeedbackCreateResult = {
    newFeedback: Schema["Feedback"]["type"] | null;
    errors: any[] | undefined;
};
/**
 * 새로운 피드백을 생성합니다.
 */
export const createFeedback = async (
    userId: string,
    itemType: string,
    rating: number,
    content?: string
): Promise<FeedbackCreateResult> => {
    try {
        const { data: newFeedback, errors } =
            await client.models.Feedback.create({
                userId: userId,
                itemType: itemType,
                rating: rating,
                content: content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

        if (errors) {
            console.error("Error creating feedback:", errors);
        }

        return { newFeedback, errors };
    } catch (error) {
        console.error(
            "An unexpected error occurred while creating feedback:",
            error
        );
        return { newFeedback: null, errors: [error as any] };
    }
};

export type AverageRatingResult = {
    averageRating: number | null;
    errors: any[] | null;
};
/**
 * 특정 id와 itemType에 대한 rating 평균을 계산합니다.
 */
export const getAverageRating = async (
    id: string,
    itemType: string
): Promise<AverageRatingResult> => {
    try {
        const { data: feedbacks, errors } = await client.models.Feedback.list({
            filter: {
                id: { eq: id },
                itemType: { eq: itemType },
            },
        });

        if (errors) {
            console.error("Error fetching feedbacks:", errors);
            return { averageRating: null, errors };
        }

        if (!feedbacks || feedbacks.length === 0) {
            return { averageRating: 0, errors: null };
        }

        const totalRating = feedbacks.reduce(
            (sum, feedback) => sum + (feedback.rating || 0),
            0
        );
        const averageRating = totalRating / feedbacks.length;

        return { averageRating, errors: null };
    } catch (error) {
        console.error(
            "An unexpected error occurred while calculating average rating:",
            error
        );
        return { averageRating: null, errors: [error as any] };
    }
};

export type SortOption =
    | "name-asc"
    | "name-desc"
    | "created-asc"
    | "created-desc"
    | "rating-asc"
    | "rating-desc";

export type BatchAverageRatingResult = {
    ratings: Map<string, number>;
    sortedItems: Array<{ id: string; rating: number }>;
    errors: any[] | null;
};

/**
 * 특정 itemType에 대한 모든 아이템의 rating 평균을 일괄 조회하고 정렬합니다.
 */
export const getBatchAverageRatings = async (
    itemType: string,
    sortBy: SortOption = "name-asc"
): Promise<BatchAverageRatingResult> => {
    try {
        const ratingsMap = new Map<string, number>();
        const feedbackCountMap = new Map<string, number>();
        const allErrors: any[] = [];

        // 해당 itemType의 모든 피드백을 가져옴
        const { data: feedbacks, errors } = await client.models.Feedback.list({
            filter: {
                itemType: { eq: itemType },
            },
        });

        if (errors) {
            console.error("Error fetching feedbacks:", errors);
            allErrors.push(...errors);
        }

        // id별로 rating 평균 계산
        if (feedbacks && feedbacks.length > 0) {
            const itemGroups = new Map<string, number[]>();

            feedbacks.forEach((feedback) => {
                const ratings = itemGroups.get(feedback.id) || [];
                ratings.push(feedback.rating);
                itemGroups.set(feedback.id, ratings);
            });

            itemGroups.forEach((ratings, id) => {
                const average =
                    ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
                ratingsMap.set(id, average);
                feedbackCountMap.set(id, ratings.length);
            });
        }

        // Dish 정보 가져오기 (이름과 생성시각 정렬을 위해)
        const { data: dishes, errors: dishErrors } =
            await client.models.Dish.list();

        if (dishErrors) {
            console.error("Error fetching dishes:", dishErrors);
            allErrors.push(...dishErrors);
        }

        // 정렬을 위한 배열 생성
        let sortedItems = Array.from(ratingsMap.entries()).map(
            ([id, rating]) => {
                const dish = dishes?.find((d) => d.id === id);
                return {
                    id,
                    rating,
                    name: dish?.name || "",
                    createdAt: dish?.createdAt || "",
                    feedbackCount: feedbackCountMap.get(id) || 0,
                };
            }
        );

        // 정렬 적용
        switch (sortBy) {
            case "name-asc":
                sortedItems.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sortedItems.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "created-asc":
                sortedItems.sort((a, b) =>
                    a.createdAt.localeCompare(b.createdAt)
                );
                break;
            case "created-desc":
                sortedItems.sort((a, b) =>
                    b.createdAt.localeCompare(a.createdAt)
                );
                break;
            case "rating-asc":
                sortedItems.sort((a, b) => a.feedbackCount - b.feedbackCount);
                break;
            case "rating-desc":
                sortedItems.sort((a, b) => b.feedbackCount - a.feedbackCount);
                break;
        }

        return {
            ratings: ratingsMap,
            sortedItems: sortedItems.map(({ id, rating }) => ({
                id,
                rating,
            })),
            errors: allErrors.length > 0 ? allErrors : null,
        };
    } catch (error) {
        console.error(
            "An unexpected error occurred while batch fetching ratings:",
            error
        );
        return {
            ratings: new Map(),
            sortedItems: [],
            errors: [error as any],
        };
    }
};
