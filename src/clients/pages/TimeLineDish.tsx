import { Box, CircularProgress, Stack, Alert } from "@mui/material";
import ItemListView from "../components/ItemListView";
import { useEffect, useState } from "react";
import { fetchDishes } from "../api/data";
import type { Item } from "../types/item";

export default function TimelineDish() {
    const [dishes, setDishes] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDishes();
    }, []);

    const loadDishes = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const { dish, errors } = await fetchDishes();

            if (errors) {
                console.error("Error fetching dishes:", errors);
                setError("음식 데이터를 불러오는데 실패했습니다.");
                setDishes([]);
            } else if (dish) {
                // Schema 타입을 Dish 타입으로 변환
                const formattedDishes: Item[] = dish.map(d => ({
                    id: d.id,
                    itemType: "dish",
                    img: d.img || "",
                    name: d.name,
                    brand: d.brand || "",
                }));
                setDishes(formattedDishes);
            } else {
                setDishes([]);
            }
        } catch (err) {
            console.error("Unexpected error loading dishes:", err);
            setError("예상치 못한 오류가 발생했습니다.");
            setDishes([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "70vh" }}>
                <CircularProgress />
            </Stack>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (dishes.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="info">
                    등록된 음식이 없습니다. 관리자 페이지에서 음식을 추가해주세요.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <ItemListView 
                items={dishes}
                initialView="detailed"
            />
        </Box>
    );
}