// "유저들의 상품에 대한 평가" 를 의미하는 타입이름
export interface Feedback {
    id: string; // 고유 ID
    userId: string; // 평가를 남긴 유저 ID
    itemType: 'dish'; // | 'drink' | 'snack'; // 평가 대상 상품 유형
    rating: number; // 평점 (예: 1-5)
    content: string; // 평가 내용
    createdAt: Date; // 평가 작성일
    updatedAt: Date; // 평가 수정일
}