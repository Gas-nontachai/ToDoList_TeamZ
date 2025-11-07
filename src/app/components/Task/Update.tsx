"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react"; // เพิ่ม Loader2, CheckCircle2

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/misc/types";
import { useCategory, useTask } from "@/hook/hooks";

interface UpdateTaskProps {
  onClose: () => void;
  onRefresh: () => void;
  open: boolean;
  task_id: string;
}

const emptyTask: Task = {
  task_id: "",
  text: "",
  category: "General",
  completed: false,
  createdAt: new Date(),
  completedAt: undefined,
};

// 💡 กำหนด General ID ให้สอดคล้องกับ TodoListPage
const GENERAL_ID = "default_general";

const UpdateTask: React.FC<UpdateTaskProps> = ({
  onClose,
  open,
  onRefresh,
  task_id,
}) => {
  const { getTaskByID, updateTaskBy } = useTask();
  const { getCategoryBy } = useCategory();

  const [task, setTask] = useState<Task>(emptyTask);
  const [categories, setCategories] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false); // State สำหรับปุ่ม Loading

  const fetchTask = useCallback(async () => {
    if (!task_id) {
      setTask(emptyTask);
      return;
    }
    try {
      const res = await getTaskByID({ task_id });
      setTask(res);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  }, [getTaskByID, task_id]);

  const fetchCategories = useCallback(async () => {
    try {
      const { docs } = await getCategoryBy();
      // 💡 รวม General ID เข้าไปใน categories
      const categoryNames = docs.map((item) => item.category_name);
      if (!categoryNames.includes(GENERAL_ID)) {
        categoryNames.unshift(GENERAL_ID); // ให้ General เป็นตัวเลือกแรกเสมอ
      }
      setCategories(categoryNames);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [getCategoryBy]);

  useEffect(() => {
    if (open) {
      fetchTask();
      fetchCategories();
    }
  }, [open, fetchTask, fetchCategories]);

  const getCategoryDisplayName = (categoryId: string) => {
    return categoryId === GENERAL_ID ? "General" : categoryId;
  };

  const selectedCategory = useMemo(() => {
    // 💡 ใช้ GENERAL_ID เป็น fallback หาก category ที่บันทึกไว้ไม่พบใน options
    if (!task.category || !categories.includes(task.category)) {
      return GENERAL_ID;
    }
    return task.category;
  }, [task.category, categories]);

  const handleUpdate = async () => {
    if (!task.text.trim()) {
      toast.error("Please provide a task name");
      return;
    }

    setIsUpdating(true);
    try {
      await updateTaskBy(task);
      toast.success("Task updated successfully!");
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task", {
        description: "Please try again in a moment.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent 
        // 💡 ปรับ Dark Mode Style
        className="max-w-lg rounded-none border border-gray-700 bg-gray-900 p-0 shadow-2xl text-white"
      >
        <DialogHeader 
          // 💡 ปรับ Header Style ให้เข้มขึ้น
          className="space-y-2 rounded-t-none border-b border-gray-700 bg-gray-800 px-6 py-5"
        >
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-white">
            <Sparkles className="h-5 w-5 text-primary" />
            Edit Task
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-gray-400">
            Refresh the wording, switch categories, or mark it complete.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="update-task-name" className="text-gray-400">
              Task name
            </Label>
            <Input
              id="update-task-name"
              value={task.text}
              onChange={(event) =>
                setTask({ ...task, text: event.target.value })
              }
              maxLength={100}
              // 💡 ปรับ Input Style
              className="rounded-none border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-primary"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{(task.text ?? "").length}/100 characters</span>
              <span className="text-primary/70">Keep it punchy and fun!</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-task-category" className="text-gray-400">
              Category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setTask({ ...task, category: value })}
            >
              <SelectTrigger
                id="update-task-category"
                // 💡 ปรับ Select Style
                className="rounded-none border-gray-700 bg-gray-800 text-white hover:border-primary/50"
              >
                <SelectValue placeholder="Choose a category">
                  {getCategoryDisplayName(selectedCategory)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent 
                // 💡 ปรับ Select Content Style
                className="rounded-none border border-gray-700 bg-gray-800 text-white"
              >
                {categories.length === 0 ? (
                  <SelectItem value="__loading" disabled>
                    No categories available
                  </SelectItem>
                ) : (
                  categories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {getCategoryDisplayName(option)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span>Currently:</span>
              <Badge 
                // 💡 ปรับ Badge Style
                variant="secondary" 
                className="rounded-none bg-primary/20 text-primary border-primary/50"
              >
                {getCategoryDisplayName(task.category || "Uncategorized")}
              </Badge>
            </div>
          </div>

          <div 
            // 💡 ปรับ Checkbox/Wrapper Style
            className="flex items-center gap-2 rounded-none border border-gray-700 bg-gray-800 px-4 py-3"
          >
            <Checkbox
              id="update-task-completed"
              checked={task.completed}
              onCheckedChange={(checked) => {
                const isChecked = checked === true;
                setTask({
                  ...task,
                  completed: isChecked,
                  completedAt: isChecked ? new Date() : undefined,
                });
              }}
              // 💡 ปรับ Checkbox Style
              className="rounded-none border-primary/40 data-[state=checked]:bg-primary"
            />
            <div className="flex flex-col">
              <Label htmlFor="update-task-completed" className="text-sm text-white">
                Mark as completed
              </Label>
              <span className="text-xs text-gray-500">
                Perfect for celebrating progress or undoing it quickly.
              </span>
            </div>
          </div>
        </div>

        <DialogFooter 
          // 💡 ปรับ Footer Style
          className="gap-2 rounded-b-none border-t border-gray-700 bg-gray-800 px-6 py-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            // 💡 ปรับ Cancel Button Style
            className="rounded-none border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            // 💡 ปรับ Save Button Style
            className="rounded-none bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/80"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTask;