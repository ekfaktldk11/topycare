import { Box } from "@mui/material";
import ItemListView from "../components/ItemListView";
import { sampleDishes } from "./sampleDishes";

export default function TimelineDish() {
    return (
        <Box sx={{ p: 2 }}>
            <ItemListView items={sampleDishes} height={"60vh"} initialView="detailed"/>
        </Box>
    );
}