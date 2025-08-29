import { ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import type { Dish } from "../types/index";

type ItemCompactRowProps = {
    dish: Dish;
    affectIsRatio?: boolean;
};

const normalizeAffect = (n: number, ratio?: boolean) => {
    const v = ratio ? n * 100 : n;
    return Math.max(0, Math.min(100, isFinite(v) ? v : 0));
};

export default function ItemCompactRow({ dish, affectIsRatio }: ItemCompactRowProps) {
    const value = normalizeAffect(dish.affect, affectIsRatio);
    return (
        <ListItem disablePadding divider>
            <ListItemButton>
                <ListItemText
                    primary={
                        <Stack direction={{ xs: "column", sm: "row" }} gap={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap title={dish.name}>
                                {dish.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap title={dish.brand}>
                                {dish.brand}
                            </Typography>
                            <Typography variant="body2" sx={{ ml: { sm: "auto" }, fontVariantNumeric: "tabular-nums" }}>
                                영향도 {value.toFixed(0)}%
                            </Typography>
                        </Stack>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}
