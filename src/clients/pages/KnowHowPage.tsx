import { useState, useEffect } from "react";
import {
    Box,
    Stack,
    Typography,
    CircularProgress,
    Alert,
    Fab,
    Tabs,
    Tab,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import KnowHowEditor from "../components/know-how/KnowHowEditor";
import KnowHowItem from "../components/know-how/KnowHowItem";
import KnowHowDetailDialog from "../components/know-how/KnowHowDetailDialog";
import {
    getKnowHows,
    createKnowHow,
    updateKnowHow,
    addKnowHowUpvote,
    removeKnowHowUpvote,
    getKnowHowUpvoteCount,
    checkKnowHowUpvoted,
} from "../api/data";
import type { Schema } from "../../../amplify/data/resource";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "aws-amplify/auth";

type FilterTab = "all" | "my" | "liked";
type SortOrder = "newest" | "oldest";

export default function KnowHowPage() {
    const { isAuthenticated } = useAuth();
    const [knowHows, setKnowHows] = useState<Schema["KnowHow"]["type"][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingKnowHow, setEditingKnowHow] = useState<Schema["KnowHow"]["type"] | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedKnowHow, setSelectedKnowHow] = useState<Schema["KnowHow"]["type"] | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    
    // 좋아요 상태 관리
    const [upvoteCounts, setUpvoteCounts] = useState<Map<string, number>>(new Map());
    const [upvotedKnowHows, setUpvotedKnowHows] = useState<Set<string>>(new Set());
    
    // 필터 & 정렬
    const [filterTab, setFilterTab] = useState<FilterTab>("all");
    const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

    useEffect(() => {
        loadCurrentUser();
        loadKnowHows();
    }, [isAuthenticated]);

    const loadCurrentUser = async () => {
        if (!isAuthenticated) {
            setCurrentUserId(null);
            return;
        }
        
        try {
            const user = await getCurrentUser();
            setCurrentUserId(user.userId);
        } catch (error) {
            console.error("Error loading current user:", error);
            setCurrentUserId(null);
        }
    };

    const loadKnowHows = async () => {
        setLoading(true);
        setError(null);

        try {
            const { knowHows: knowHowList, errors } = await getKnowHows();

            if (errors) {
                console.error("Error fetching know-hows:", errors);
                setError("노하우를 불러오는데 실패했습니다.");
                setKnowHows([]);
            } else if (knowHowList) {
                setKnowHows(knowHowList);
                
                // 좋아요 개수는 항상 로드 (공개 정보)
                await loadUpvoteStates(knowHowList);
            } else {
                setKnowHows([]);
            }
        } catch (err) {
            console.error("Unexpected error loading know-hows:", err);
            setError("예상치 못한 오류가 발생했습니다.");
            setKnowHows([]);
        } finally {
            setLoading(false);
        }
    };

    const loadUpvoteStates = async (knowHowList: Schema["KnowHow"]["type"][]) => {
        const counts = new Map<string, number>();
        const upvoted = new Set<string>();

        for (const knowHow of knowHowList) {
            // 좋아요 개수는 모든 사용자가 볼 수 있음
            const { count } = await getKnowHowUpvoteCount(knowHow.id);
            counts.set(knowHow.id, count);

            // 내가 좋아요를 눌렀는지는 로그인한 사용자만 확인
            if (isAuthenticated) {
                const isUpvoted = await checkKnowHowUpvoted(knowHow.id);
                if (isUpvoted) {
                    upvoted.add(knowHow.id);
                }
            }
        }

        setUpvoteCounts(counts);
        setUpvotedKnowHows(upvoted);
    };

    const handleCreateKnowHow = async (data: {
        title: string;
        content: string;
        contentType: "markdown" | "text";
    }) => {
        if (!isAuthenticated) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const { newKnowHow, errors } = await createKnowHow(
                data.title,
                data.content,
                data.contentType
            );

            if (errors) {
                console.error("Error creating know-how:", errors);
                alert("노하우 작성에 실패했습니다.");
            } else if (newKnowHow) {
                await loadKnowHows();
                setEditorOpen(false);
            }
        } catch (error) {
            console.error("Unexpected error creating know-how:", error);
            alert("예상치 못한 오류가 발생했습니다.");
        }
    };

    const handleUpdateKnowHow = async (data: {
        title: string;
        content: string;
        contentType: "markdown" | "text";
    }) => {
        if (!editingKnowHow) return;

        try {
            const { updatedKnowHow, errors } = await updateKnowHow(
                editingKnowHow.id,
                data.title,
                data.content
            );

            if (errors) {
                console.error("Error updating know-how:", errors);
                alert("노하우 수정에 실패했습니다.");
            } else if (updatedKnowHow) {
                await loadKnowHows();
                setEditorOpen(false);
                setEditingKnowHow(null);
            }
        } catch (error) {
            console.error("Unexpected error updating know-how:", error);
            alert("예상치 못한 오류가 발생했습니다.");
        }
    };

    const handleUpvoteToggle = async (knowHowId: string) => {
        if (!isAuthenticated) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isUpvoted = upvotedKnowHows.has(knowHowId);

        try {
            if (isUpvoted) {
                const { success, errors } = await removeKnowHowUpvote(knowHowId);
                if (success) {
                    setUpvotedKnowHows((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(knowHowId);
                        return newSet;
                    });
                    setUpvoteCounts((prev) => {
                        const newMap = new Map(prev);
                        newMap.set(knowHowId, (prev.get(knowHowId) || 1) - 1);
                        return newMap;
                    });
                } else {
                    console.error("Error removing upvote:", errors);
                }
            } else {
                const { upvote, errors } = await addKnowHowUpvote(knowHowId);
                if (upvote) {
                    setUpvotedKnowHows((prev) => new Set(prev).add(knowHowId));
                    setUpvoteCounts((prev) => {
                        const newMap = new Map(prev);
                        newMap.set(knowHowId, (prev.get(knowHowId) || 0) + 1);
                        return newMap;
                    });
                } else {
                    console.error("Error adding upvote:", errors);
                }
            }
        } catch (error) {
            console.error("Unexpected error toggling upvote:", error);
        }
    };

    const handleEdit = (knowHow: Schema["KnowHow"]["type"]) => {
        setEditingKnowHow(knowHow);
        setEditorOpen(true);
    };

    const handleCardClick = (knowHow: Schema["KnowHow"]["type"]) => {
        setSelectedKnowHow(knowHow);
        setDetailDialogOpen(true);
    };

    const handleEditorClose = () => {
        setEditorOpen(false);
        setEditingKnowHow(null);
    };

    const handleFilterChange = (_event: React.SyntheticEvent, newValue: FilterTab) => {
        setFilterTab(newValue);
    };

    const handleSortChange = (event: SelectChangeEvent<SortOrder>) => {
        setSortOrder(event.target.value as SortOrder);
    };

    // 필터링 및 정렬
    const getFilteredAndSortedKnowHows = () => {
        let filtered = [...knowHows];

        // 필터링
        if (filterTab === "my" && currentUserId) {
            filtered = filtered.filter((kh) => kh.owner === currentUserId);
        } else if (filterTab === "liked") {
            filtered = filtered.filter((kh) => upvotedKnowHows.has(kh.id));
        }

        // 정렬
        filtered.sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);

            if (sortOrder === "newest") {
                return dateB.getTime() - dateA.getTime();
            } else {
                return dateA.getTime() - dateB.getTime();
            }
        });

        return filtered;
    };

    const filteredKnowHows = getFilteredAndSortedKnowHows();

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

    return (
        <Box sx={{ p: 2, pb: 10 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                노하우 공유
            </Typography>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Tabs value={filterTab} onChange={handleFilterChange}>
                    <Tab label="전체" value="all" />
                    <Tab label="내 게시물" value="my" disabled={!isAuthenticated} />
                    <Tab label="내 좋아요" value="liked" disabled={!isAuthenticated} />
                </Tabs>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select value={sortOrder} onChange={handleSortChange}>
                        <MenuItem value="newest">최신순</MenuItem>
                        <MenuItem value="oldest">오래된순</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            {filteredKnowHows.length === 0 ? (
                <Alert severity="info">
                    {filterTab === "my"
                        ? "작성한 노하우가 없습니다."
                        : filterTab === "liked"
                        ? "좋아요를 누른 노하우가 없습니다."
                        : "등록된 노하우가 없습니다."}
                </Alert>
            ) : (
                <Stack spacing={2}>
                    {filteredKnowHows.map((knowHow) => (
                        <KnowHowItem
                            key={knowHow.id}
                            knowHow={knowHow}
                            upvoteCount={upvoteCounts.get(knowHow.id) || 0}
                            isUpvoted={upvotedKnowHows.has(knowHow.id)}
                            isOwner={currentUserId === knowHow.owner}
                            onUpvote={() => handleUpvoteToggle(knowHow.id)}
                            onEdit={() => handleEdit(knowHow)}
                            onCardClick={() => handleCardClick(knowHow)}
                        />
                    ))}
                </Stack>
            )}

            {isAuthenticated && (
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: "fixed", bottom: 16, right: 16 }}
                    onClick={() => setEditorOpen(true)}
                >
                    <EditIcon />
                </Fab>
            )}

            <KnowHowEditor
                open={editorOpen}
                onClose={handleEditorClose}
                onSubmit={editingKnowHow ? handleUpdateKnowHow : handleCreateKnowHow}
                editingKnowHow={editingKnowHow}
            />

            <KnowHowDetailDialog
                open={detailDialogOpen}
                knowHow={selectedKnowHow}
                onClose={() => setDetailDialogOpen(false)}
            />
        </Box>
    );
}
