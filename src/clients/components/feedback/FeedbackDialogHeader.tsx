import { Box, Typography, Stack } from "@mui/material";
import type { Dish } from "../../types";

interface FeedbackDialogHeaderProps {
    dish: Dish;
}

export default function FeedbackDialogHeader({ dish }: FeedbackDialogHeaderProps) {
    return (
        <Box
            sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                position: "sticky",
                top: 0,
                backgroundColor: "background.paper",
                zIndex: 1,
            }}
        >
            <Stack direction="row" gap={2} alignItems="center">
                <img
                    src={dish.img}
                    alt={dish.name}
                    style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }}
                />
                <Stack>
                    <Typography variant="subtitle1" fontWeight={700}>
                        {dish.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {dish.brand}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}