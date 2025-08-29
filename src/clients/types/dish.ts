export type Dish = {
    id?: string; // 상품 ID
    img: string; // 이미지 URL
    name: string; // 상품 이름
    brand?: string; // 상품 브랜드
    affect: number; // 영향도 (0~100 또는 0~1 모두 허용)
};
