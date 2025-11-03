"use client";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { Task } from "@/misc/types";
import { useTask } from "@/hook/hooks";
interface UpdateTaskProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
    task_id: string;
}

const UpdateTask: React.FC<UpdateTaskProps> = ({ onClose, open, onRefresh, task_id }) => {
    const { getTaskByID, updateTaskBy } = useTask();
    const [task, setTask] = useState<Task>({
        task_id: "",
        text: "",
        category: "General",
        completed: false,
        createdAt: new Date(),
        completedAt: undefined,
    });

    const fetchTask = useCallback(async () => {
        try {
            const res = await getTaskByID({ task_id });
            setTask(res);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    }, [getTaskByID, task_id]);

    useEffect(() => {
        if (open) fetchTask();
    }, [open, fetchTask]);

    const handleUpdate = async () => {
        try {
            await updateTaskBy(task);
            Swal.fire({
                icon: "success",
                title: "Task updated successfully!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                background: "#f3f4f6",
                color: "#111827",
                iconColor: "#10b981",
            });
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error updating task:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to update task!",
                background: "#fef2f2",
                color: "#7f1d1d",
                iconColor: "#dc2626",
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            sx={{
                "& .MuiDialog-paper": { borderRadius: "20px", padding: "16px" },
            }}
        >
            <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                ✏️ Update Task
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Task Name"
                    fullWidth
                    value={task.text}
                    onChange={(e) => setTask({ ...task, text: e.target.value })}
                    required
                    sx={{ borderRadius: "10px", marginTop: "8px" }}
                />

                <Select
                    fullWidth
                    value={task.category}
                    onChange={(e) => setTask({ ...task, category: e.target.value })}
                    sx={{ borderRadius: "10px" }}
                >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Work">Work</MenuItem>
                    <MenuItem value="Personal">Personal</MenuItem>
                </Select>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={task.completed}
                            onChange={(e) =>
                                setTask({
                                    ...task,
                                    completed: e.target.checked,
                                    completedAt: e.target.checked ? new Date() : undefined,
                                })
                            }
                            sx={{ color: task.completed ? "#10b981" : "" }}
                        />
                    }
                    label="Mark as Completed"
                />
            </DialogContent>

            <DialogActions sx={{ paddingX: "16px", paddingBottom: "16px" }}>
                <Button onClick={onClose} variant="outlined" color="error" sx={{ borderRadius: "10px" }}>
                    Cancel
                </Button>
                <Button onClick={handleUpdate} variant="contained" sx={{ borderRadius: "10px", backgroundColor: "#10b981", "&:hover": { backgroundColor: "#059669" } }}>
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateTask;
