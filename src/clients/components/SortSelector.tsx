import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import type { SortOption } from "../api/data";

type SortSelectorProps = {
    value: SortOption;
    onChange: (value: SortOption) => void;
};

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name-asc", label: "이름 (가나다순)" },
    { value: "name-desc", label: "이름 (역순)" },
    { value: "created-asc", label: "생성일 (오래된순)" },
    { value: "created-desc", label: "생성일 (최신순)" },
    { value: "rating-asc", label: "평가 적은순" },
    { value: "rating-desc", label: "평가 많은순" },
];

export default function SortSelector({ value, onChange }: SortSelectorProps) {
    const handleChange = (event: SelectChangeEvent<SortOption>) => {
        onChange(event.target.value as SortOption);
    };

    return (
        <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="sort-select-label">정렬</InputLabel>
            <Select
                labelId="sort-select-label"
                id="sort-select"
                value={value}
                label="정렬"
                onChange={handleChange}
            >
                {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}