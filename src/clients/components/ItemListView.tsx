import * as React from "react";
import { Box, Grid, List, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList"; // 간단히 보기
import ViewModuleIcon from "@mui/icons-material/ViewModule"; // 크게 보기
import type { Dish, ViewMode } from "../types/index";
import ItemCard from "./ItemCard";
import ItemCompactRow from "./ItemCompactRow";
import ImageDialog from "./ImageDialog";

export interface ItemListViewProps {
    items: Dish[];
    /** 리스트 영역 높이. css height 값. 기본: 70vh */
    height?: number | string;
    /** 초기 보기 모드 */
    initialView?: ViewMode;
    /** 영향도 값을 0~1 스케일로 받는다면 true */
    affectIsRatio?: boolean;
}

export default function ItemListView({ items, height = "70vh", initialView = "detailed", affectIsRatio = false, }: ItemListViewProps) {
    const [view, setView] = React.useState<ViewMode>(initialView);
    const [openImg, setOpenImg] = React.useState<string | null>(null);

    const handleToggle = (_: React.MouseEvent<HTMLElement>, next: ViewMode | null) => {
        if (next) setView(next);
    };

    return (
        <Stack gap={1.5} sx={{ height: "100%" }}>
            {/* 헤더 / 보기 토글 */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    아이템 {items.length.toLocaleString()}개
                </Typography>
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

            {/* 스크롤 영역 */}
            <Box sx={{ overflow: "auto", height }}>
                {view === "detailed" ? (
                    <Grid container spacing={2}>
                        {items.map((it, idx) => (
                            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <ItemCard dish={it} affectIsRatio={affectIsRatio} onZoom={setOpenImg} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <List disablePadding>
                        {items.map((it, idx) => (
                            <ItemCompactRow key={idx} dish={it} affectIsRatio={affectIsRatio} />
                        ))}
                    </List>
                )}
            </Box>

            <ImageDialog src={openImg} onClose={() => setOpenImg(null)} />
        </Stack>
    );
}
