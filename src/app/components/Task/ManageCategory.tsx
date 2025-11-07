"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  RotateCcw,
  Trash2,
  Pencil,
  ListTodo,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/misc/types";
import { useCategory } from "@/hook/hooks";
import { generateID } from "@/utils/generator-id";
import { useConfirmDialog } from "@/components/providers/confirm-dialog-provider";

interface UpdateCategoryProps {
  onClose: () => void;
  onRefresh: () => void;
  open: boolean;
}

const emptyCategory: Category = { category_id: "", category_name: "" };

const GeneralCategory: Category = { category_id: "default_general", category_name: "General" };
const GENERAL_ID = "default_general";

const ManageCategory: React.FC<UpdateCategoryProps> = ({
  onClose,
  open,
  onRefresh,
}) => {
  const { getCategoryBy, insertCategory, updateCategoryBy, deleteCategoryBy } =
    useCategory();
  const confirmDialog = useConfirmDialog();

  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>(emptyCategory);

  const isEditMode = useMemo(
    () => category.category_id !== "",
    [category.category_id]
  );

  const fetchCategory = useCallback(async () => {
    try {
      const { docs } = await getCategoryBy();
      const categoriesWithGeneral = [GeneralCategory, ...docs];
      setCategories(categoriesWithGeneral);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  }, [getCategoryBy]);

  useEffect(() => {
    if (open) {
      fetchCategory();
    }
  }, [open, fetchCategory]);

  const resetForm = () => {
    setCategory(emptyCategory);
  };

  const handleSubmit = async () => {
    const name = category.category_name.trim();
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }
    if (category.category_id === GENERAL_ID) {
      toast.error("Cannot modify the General category.");
      return;
    }
    try {
      const { docs: allCategories } = await getCategoryBy();
      const duplicate = allCategories.find(
        (c) =>
          c.category_name.trim().toLowerCase() === name.toLowerCase() &&
          c.category_id !== category.category_id
      );

      if (duplicate) {
        toast.error("Category already exists", {
          description: "Try another playful name.",
        });
        return;
      }

      if (isEditMode) {
        await updateCategoryBy(category);
        toast.success("Category updated successfully!");
      } else {
        await insertCategory({ ...category, category_id: generateID() });
        toast.success("Category added successfully!");
      }

      await fetchCategory();
      onRefresh();
      resetForm();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === GENERAL_ID) {
      toast.error("The General category cannot be deleted.");
      return;
    }

    const confirmed = await confirmDialog({
      title: "Delete this category?",
      description: "Tasks won't be removed, but they will lose this tag.",
      confirmText: "Delete",
      cancelText: "Keep it",
      variant: "destructive",
    });

    if (!confirmed) {
      toast.info("Deletion cancelled.", {
        description: "Your category is still available.",
      });
      return;
    }

    try {
      await deleteCategoryBy({ category_id: id });
      await fetchCategory();
      onRefresh();
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
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
      <DialogContent className="max-w-xl rounded-none border border-gray-700 bg-gray-900 p-0 shadow-xl">
        <DialogHeader className="space-y-2 border-b border-gray-700 bg-gray-900 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-white">
            <ListTodo className="h-6 w-6 text-primary" />
            Manage Categories
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-gray-400">
            Organize your tasks by meaningful categories.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="category-name" className="text-gray-400">
              Category name
            </Label>
            <div className="flex gap-2">
              <Input
                id="category-name"
                value={category.category_name}
                placeholder="e.g. Personal, Work, Shopping"
                onChange={(event) =>
                  setCategory({
                    ...category,
                    category_name: event.target.value,
                  })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
                className="rounded-none border border-gray-700 bg-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-primary"
                disabled={category.category_id === GENERAL_ID}
              />
              <Button
                type="button"
                variant="default"
                size="icon"
                onClick={resetForm}
                className="rounded-none border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Reset</span>
              </Button>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            variant="default"
            disabled={category.category_id === GENERAL_ID}
            className={`w-full gap-2 rounded-none shadow-sm h-10 font-semibold border border-gray-700
              ${isEditMode
                ? "bg-gray-700 text-primary hover:bg-gray-600"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-primary"
              }
            `}
          >
            {isEditMode ? (
              <>
                <Pencil className="h-4 w-4" />
                Save changes
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add category
              </>
            )}
          </Button>
          <Card className="rounded-none border border-gray-700 bg-gray-800">
            <CardContent className="p-0">
              {/* ⬅️ แก้ไข: ใช้ความสูงคงที่ h-[200px] และเพิ่ม class "scrollbar-show" */}
              <ScrollArea className="h-[200px] scrollbar-show">
                <div className="divide-y divide-gray-700">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <div
                        key={cat.category_id}
                        className={`flex items-center justify-between gap-3 px-4 py-3 transition 
                          ${cat.category_id === GENERAL_ID 
                            ? 'bg-gray-700/50' 
                            : 'hover:bg-gray-700'
                          }`
                        }
                      >
                        <span className="text-sm font-medium text-white">
                          {cat.category_name}
                          {cat.category_id === GENERAL_ID && (
                            <span className="ml-2 text-xs text-gray-500">(Default)</span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          {cat.category_id !== GENERAL_ID ? (
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setCategory(cat)}
                                className="gap-1 rounded-none text-gray-400 hover:bg-primary/20 hover:text-primary"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(cat.category_id)}
                                className="rounded-none h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">
                                  Delete {cat.category_name}
                                </span>
                              </Button>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500 italic">System Default</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500">
                      No categories found.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="border-t border-gray-700 bg-gray-800 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-none border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCategory;