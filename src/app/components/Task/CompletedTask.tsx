import React from "react";
import {
    List,
    ListItem,
    IconButton,
    Checkbox,
    Typography,
    Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Task } from "@/misc/types";
import { formatDate } from "@/utils/date-helper"

interface CompletedTaskListProps {
    completedTasks: Task[];
    deleteTask: (id: string) => void;
    toggleTaskCompletion: (id: string, completed: boolean) => void;
}

const CompletedTaskList: React.FC<CompletedTaskListProps> = ({
    completedTasks,
    deleteTask,
    toggleTaskCompletion,
}) => {
    return (
        <List>
            {completedTasks.map((t, index) => (
                <ListItem
                    key={index}
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(t.task_id)}>
                            <Delete />
                        </IconButton>
                    }
                >
                    <Checkbox
                        checked={t.completed}
                        onChange={() => toggleTaskCompletion(t.task_id, false)}
                    />
                    <Box
                        sx={{
                            textDecoration: t.completed ? "line-through" : "none",
                            textDecorationColor: t.completed ? "#1f2937" : "inherit",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" className="font-bold text-gray-800">
                            {t.text}
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                            <Typography variant="body2" className="text-gray-600">
                                Category: {t.category}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                                Created: {formatDate(t.createdAt, "dd/MM/yyyy HH:mm:ss")}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                                Completed: {t.completedAt && formatDate(t.completedAt, "dd/MM/yyyy HH:mm:ss")}
                            </Typography>
                        </Box>
                    </Box>
                </ListItem>
            ))}
        </List>
    );
};

export default CompletedTaskList;
