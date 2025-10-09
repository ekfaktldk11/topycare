// "유저들의 상품에 대한 평가" 를 의미하는 타입이름

/**
 * pk : itemId & userID & productType 로,
 * 이렇게 하면, 한 유저가 한 상품에 대해 여러개의 평가를 남길 수 없게 되는데 이것은 의도다.
 * 의도인 이유는 도배성 Feedback 아이템을 추가할 수 없게 하기위함임.
 */

export interface Feedback {
    itemId: string; // 평가 ID
    userId: number; // 평가를 남긴 유저 ID
    productType: 'dish'; // | 'drink' | 'snack'; // 평가 대상 상품 유형
    productId: number; // 평가 대상 상품 ID
    rating: number; // 평점 (예: 1-5)
    content: string; // 평가 내용
    createdAt: Date; // 평가 작성일
    updatedAt: Date; // 평가 수정일
}