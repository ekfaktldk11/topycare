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
        }, { authMode: "userPool" });

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
    return { dish, errors };
};

export type FeedbackCreateResult = {
    newFeedback: Schema["Feedback"]["type"] | null;
    errors: any[] | undefined;
    duplicated?: boolean;
};
/**
 * 새로운 피드백을 생성합니다.
 */
export const createFeedback = async (
    itemId: string,
    itemType: string,
    rating: number,
    content?: string,
): Promise<FeedbackCreateResult> => {
    try {
        const alreadyExists = await client.models.Feedback.list({
            filter: {
                itemId: { eq: itemId },
                itemType: { eq: itemType },
            },
            authMode: "userPool",
        });

        if (alreadyExists.data && alreadyExists.data.length > 0) {
            window.alert("피드백은 한 번만 작성할 수 있습니다.\n추가할 내용은 수정 기능을 이용해 주세요.");
            return {
                newFeedback: null,
                errors: undefined,
                duplicated: true,
            };
        }

        const { data: newFeedback, errors } =
            await client.models.Feedback.create({
                itemId: itemId,
                itemType: itemType,
                rating: rating,
                content: content,
            }, { authMode: "userPool" });

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
    itemId: string,
    itemType: string
): Promise<AverageRatingResult> => {
    try {
        const { data: feedbacks, errors } = await client.models.Feedback.list({
            filter: {
                itemId: { eq: itemId },
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

        // itemId별로 rating 평균 계산
        if (feedbacks && feedbacks.length > 0) {
            const itemGroups = new Map<string, number[]>();

            feedbacks.forEach((feedback) => {
                const ratings = itemGroups.get(feedback.itemId) || []; // ✅ feedback.id → feedback.itemId
                ratings.push(feedback.rating);
                itemGroups.set(feedback.itemId, ratings);
            });

            itemGroups.forEach((ratings, itemId) => {
                const average =
                    ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
                ratingsMap.set(itemId, average);
                feedbackCountMap.set(itemId, ratings.length);
            });
        }

        // Dish 정보 가져오기 (이름과 생성시각 정렬을 위해)
        const dishIds = Array.from(ratingsMap.keys());
        const dishPromises = dishIds.map((id) =>
            client.models.Dish.get({ id })
        );
        const dishResults = await Promise.all(dishPromises);
        const dishes = dishResults
            .map((result) => result.data)
            .filter((item) => item !== null) as Schema["Dish"]["type"][];
        const dishErrors = dishResults
            .map((result) => result.errors)
            .filter((errs) => errs && errs.length > 0)
            .flat();

        if (dishErrors.length > 0) {
            throw new Error("Error fetching dishes");
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

export type FeedbackListResult = {
    feedbacks: Schema["Feedback"]["type"][] | null;
    errors: any[] | null;
};

/**
 * 특정 itemId와 itemType에 대한 모든 피드백을 가져옵니다.
 */
export const getFeedbacks = async (
    itemId: string,
    itemType: string
): Promise<FeedbackListResult> => {
    try {
        const { data: feedbacks, errors } = await client.models.Feedback.list({
            filter: {
                itemId: { eq: itemId },
                itemType: { eq: itemType },
            },
        });

        if (errors) {
            console.error("Error fetching feedbacks:", errors);
            return { feedbacks: null, errors };
        }

        return { feedbacks: feedbacks || [], errors: null };
    } catch (error) {
        console.error(
            "An unexpected error occurred while fetching feedbacks:",
            error
        );
        return { feedbacks: null, errors: [error as any] };
    }
};

export type FeedbackUpdateResult = {
    updatedFeedback: Schema["Feedback"]["type"] | null;
    errors: any[] | undefined;
};

/**
 * 기존 피드백을 수정합니다.
 */
export const updateFeedback = async (
    feedbackId: string,
    rating?: number,
    content?: string
): Promise<FeedbackUpdateResult> => {
    try {
        const updateData: {
            id: string;
            rating?: number;
            content?: string;
        } = {
            id: feedbackId,
        };

        if (rating !== undefined) {
            updateData.rating = rating;
        }

        if (content !== undefined) {
            updateData.content = content;
        }

        const { data: updatedFeedback, errors } =
            await client.models.Feedback.update(updateData, {
                authMode: "userPool",
            });

        if (errors) {
            console.error("Error updating feedback:", errors);
            return { updatedFeedback: null, errors };
        }

        return { updatedFeedback, errors };
    } catch (error) {
        console.error(
            "An unexpected error occurred while updating feedback:",
            error
        );
        return { updatedFeedback: null, errors: [error as any] };
    }
};

export type FeedbackDeleteResult = {
    deletedFeedback: Schema["Feedback"]["type"] | null;
    errors: any[] | undefined;
};

/**
 * 피드백을 삭제합니다.
 */
export const deleteFeedback = async (
    feedbackId: string
): Promise<FeedbackDeleteResult> => {
    try {
        const { data: deletedFeedback, errors } =
            await client.models.Feedback.delete({
                id: feedbackId,
            }, { authMode: "userPool" });

        if (errors) {
            console.error("Error deleting feedback:", errors);
            return { deletedFeedback: null, errors };
        }

        return { deletedFeedback, errors };
    } catch (error) {
        console.error(
            "An unexpected error occurred while deleting feedback:",
            error
        );
        return { deletedFeedback: null, errors: [error as any] };
    }
};