// "유저들의 상품에 대한 평가" 를 의미하는 타입이름
export interface Feedback {
    id: number; // 평가 ID
    userId: number; // 평가를 남긴 유저 ID
    productType: 'dish'; // | 'drink' | 'snack'; // 평가 대상 상품 유형
    productId: number; // 평가 대상 상품 ID
    rating: number; // 평점 (예: 1-5)
    content: string; // 평가 내용
    createdAt: Date; // 평가 작성일
    updatedAt: Date; // 평가 수정일
}