import * as React from "react";
import { Box, CircularProgress, Grid, List, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import type { Item, ViewMode } from "../types/index";
import ItemCard from "./ItemCard";
import ItemCompactRow from "./ItemCompactRow";
import ImageDialog from "./ImageDialog";
import SortSelector from "./SortSelector";
import { getBatchAverageRatings, type SortOption } from "../api/data";

export interface ItemListViewProps {
    items: Item[];
    /** 리스트 영역 높이. css height 값. 기본: 70vh */
    height?: number | string;
    /** 초기 보기 모드 */
    initialView?: ViewMode;
    /** 초기 정렬 옵션 */
    initialSortBy?: SortOption;
}

export default function ItemListView({ items, height = "70vh", initialView = "detailed", initialSortBy = "name-asc" }: ItemListViewProps) {
    const [view, setView] = React.useState<ViewMode>(initialView);
    const [sortBy, setSortBy] = React.useState<SortOption>(initialSortBy);
    const [openImg, setOpenImg] = React.useState<string | null>(null);
    const [ratings, setRatings] = React.useState<Map<string, number>>(new Map());
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            const { ratings: ratingsMap } = await getBatchAverageRatings("dish", sortBy);
            setRatings(ratingsMap);
            setLoading(false);
        };

        fetchRatings();
    }, [sortBy]);

    const handleToggle = (_: React.MouseEvent<HTMLElement>, next: ViewMode | null) => {
        if (next) setView(next);
    };

    if (loading) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height }}>
                <CircularProgress />
            </Stack>
        );
    }

    return (
        <Stack gap={1.5} sx={{ height: "100%" }}>
            {/* 헤더 / 정렬 & 보기 토글 */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    아이템 {items.length.toLocaleString()}개
                </Typography>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    <SortSelector value={sortBy} onChange={setSortBy} />
                    <ToggleButtonGroup size="small" value={view} exclusive onChange={handleToggle}>
                        <ToggleButton value="compact" aria-label="간단히 보기">
                            <Tooltip title="간단히 보기">
                                <ViewListIcon fontSize="small" />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="detailed" aria-label="크게 보기">
                            <Tooltip title="크게 보기">
                                <ViewModuleIcon fontSize="small" />
                            </Tooltip>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Stack>

            {/* 스크롤 영역 */}
            <Box sx={{ overflow: "auto", height }}>
                {view === "detailed" ? (
                    <Grid container spacing={2}>
                        {items.map((it, idx) => (
                            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <ItemCard item={it} onZoom={setOpenImg} rating={ratings.get(it.id) || 0} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <List disablePadding>
                        {items.map((it, idx) => (
                            <ItemCompactRow key={idx} item={it} rating={ratings.get(it.id) || 0} />
                        ))}
                    </List>
                )}
            </Box>

            <ImageDialog src={openImg} onClose={() => setOpenImg(null)} />
        </Stack>
    );
}