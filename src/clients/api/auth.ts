import { fetchUserAttributes } from "aws-amplify/auth";
import type { FetchUserAttributesOutput } from "aws-amplify/auth";

/**
 * 현재 로그인된 사용자의 속성(attributes)을 가져옵니다.
 * @returns 사용자의 속성 객체를 담은 Promise를 반환합니다.
 */
export const getUserAttributes = async (): Promise<FetchUserAttributesOutput> => {
    try {
        const attributes = await fetchUserAttributes();
        return attributes;
    } catch (error) {
        console.error("Error fetching user attributes:", error);
        throw error; // 에러를 다시 던져 호출한 쪽에서 처리하도록 합니다.
    }
};
