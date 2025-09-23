// File: src/Demo.tsx
import { Box } from "@mui/material";
import ItemListView from "../components/ItemListView";
import type { Dish } from "../types/dish";

export default function Demo() {
    const sample: Dish[] = [
        { img: "https://picsum.photos/seed/1/400/400", name: "콜드브루 커피", brand: "무명브랜드", affect: 0.3 },
        { img: "https://picsum.photos/seed/2/400/400", name: "제로 사이다", brand: "제로컴퍼니", affect: 3.5 },
        { img: "https://picsum.photos/seed/3/400/400", name: "단백질 바", brand: "프로틴랩", affect: 5 },
        { img: "https://picsum.photos/seed/4/400/400", name: "그릭요거트", brand: "헬씨팜", affect: 4 },
    ];

    return (
        <Box sx={{ p: 2 }}>
            <ItemListView items={sample} height={"60vh"} initialView="detailed" affectIsRatio />
        </Box>
    );
}
