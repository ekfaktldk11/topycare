
import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch }) => {
    const [query, setQuery] = useState('');
    const [searched, setSearched] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            setSearched(true);
            onSearch(trimmed);
        }
    };

    const clearSearch = () => {
        setQuery('');
        if (searched)
        setSearched(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: searched ? 'flex-start' : 'center',
                pt: searched ? 2 : 0,
                transition: 'all 0.4s cubic-bezier(.4,0,.2,1)'
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    width: { xs: '90%', sm: 400 },
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {query && (
                    <Button
                        onClick={clearSearch}
                        sx={{ minWidth: 0, p: 0.5, mr: 1 }}
                        aria-label="Clear search"
                    >
                        &#10005;
                    </Button>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={query}
                        onChange={handleChange}
                        placeholder={placeholder}
                        size="small"
                        sx={{ mr: 1 }}
                        autoFocus
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ minWidth: 50 }}
                        disabled={!query.trim()}
                    >
                        Search
                    </Button>
                </form>
            </Paper>
            
        </Box>
    );
};

export default SearchBar;

/**
 * 문제는 
 * 검색어를 지웠을 때, X 표ㅕ시가 사라진다는 것.
 * X 표시는 검색어가 있을 때, searched 가 true 일 때 항상 표시되어야 한다.
 * X 표시를 클릭하면, searched 가 false 가 되어야한다.
 */