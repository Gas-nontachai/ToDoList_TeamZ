"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Card,
    IconButton,
    CardContent,
    Typography,
    ListItem,
    List,
    ListItemText,
    Stack,
    ListItemSecondaryAction,
    InputAdornment,
    Box,
    Divider,
} from "@mui/material";
import { Add, Delete, Edit, Clear } from "@mui/icons-material";
import { Category } from "@/misc/types";
import { useCategory } from "@/hook/hooks";
import { generateID } from "@/utils/generator-id";

interface UpdateCategoryProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ onClose, open, onRefresh }) => {
    const { getCategoryBy, insertCategory, updateCategoryBy, deleteCategoryBy } = useCategory();
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category>({ category_id: "", category_name: "" });

    const isEditMode = category.category_id !== "";

    useEffect(() => {
        if (open) fetchCategory();
    }, [open]);

    const fetchCategory = async () => {
        try {
            const { docs: res } = await getCategoryBy();
            setCategories(res);
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    };

    const resetForm = () => {
        setCategory({ category_id: "", category_name: "" });
    };

    const handleSubmit = async () => {
        if (!category.category_name.trim()) {
            return Swal.fire({
                icon: "error",
                title: "Please enter a category name",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
            });
        }

        try {
            if (isEditMode) {
                await updateCategoryBy(category);
                Swal.fire({
                    icon: "success",
                    title: "Category updated successfully!",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                });
            } else {
                await insertCategory({ ...category, category_id: generateID() });
                Swal.fire({
                    icon: "success",
                    title: "Category added successfully!",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }

            await fetchCategory();
            resetForm();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleDelete = async (id: string) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "This action cannot be undone!",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                await deleteCategoryBy({ category_id: id });
                await fetchCategory();
                Swal.fire({
                    icon: "success",
                    title: "Category deleted successfully!",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                });
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}>
            <DialogTitle fontWeight="bold" fontSize="1.25rem">
                🗂️ Manage Categories
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <TextField
                        label="Category Name"
                        variant="outlined"
                        value={category.category_name}
                        onChange={(e) => setCategory({ ...category, category_name: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={resetForm}
                                        sx={{
                                            backgroundColor: "#f87171",
                                            color: "white",
                                            width: 36,
                                            height: 36,
                                            "&:hover": { backgroundColor: "#ef4444" },
                                        }}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color={isEditMode ? "warning" : "success"}
                        fullWidth
                        sx={{ borderRadius: 2 }}
                        startIcon={isEditMode ? <Edit /> : <Add />}
                    >
                        {isEditMode ? "Save Changes" : "Add Category"}
                    </Button>

                    <Divider />
                    <Typography variant="subtitle1" fontWeight="bold">
                        Category List
                    </Typography>
                    <Card variant="outlined" sx={{ maxHeight: 250, overflow: "auto" }}>
                        <List dense>
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <ListItem key={cat.category_id} divider>
                                        <ListItemText primary={cat.category_name} />
                                        <ListItemSecondaryAction>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => setCategory(cat)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(cat.category_id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Stack>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                                    No categories found
                                </Typography>
                            )}
                        </List>
                    </Card>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error" sx={{ borderRadius: 2 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateCategory;
