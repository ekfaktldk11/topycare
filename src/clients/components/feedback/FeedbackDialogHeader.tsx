import { Box, Typography, Stack } from "@mui/material";
import type { Item } from "../../types";

interface FeedbackDialogHeaderProps {
    item: Item;
}

export default function FeedbackDialogHeader({ item }: FeedbackDialogHeaderProps) {
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
                    src={item.img}
                    alt={item.name}
                    style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }}
                />
                <Stack>
                    <Typography variant="subtitle1" fontWeight={700}>
                        {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {item.brand}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}