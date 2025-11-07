"use client";

import React, { useMemo, useEffect } from "react";
import {
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  ListFilter,
  Plus,
  RotateCcw,
  Settings2,
  Star,
  Trash2,
  ListTodo,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import ManageCategory from "@/app/components/Task/ManageCategory";
import UpdateTask from "@/app/components/Task/Update";
import { useTodoList } from "@/hook/hooks";
import { formatDate } from "@/utils/date-helper";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// ❌ ลบตัวแปร minimalistTemplates และ expandedTemplates ออกไป เนื่องจากไม่ได้ใช้แล้ว
// const minimalistTemplates: Template[] = [...];
// const expandedTemplates: Template[] = [...];

const GENERAL_ID = "default_general";

const TodoListPage: React.FC = () => {
  const {
    // ... (useTodoList hook ไม่มีการเปลี่ยนแปลง)
    loading,
    show_completed,
    setShowCompleted,
    open_update,
    setOpenUpdate,
    open_manage_category,
    setOpenManageCategory,
    task,
    setTask,
    selected_task_id,
    search_query,
    filter_category,
    setFilterCategory,
    task_category_option,
    incomplete_tasks,
    completed_tasks,
    fetchTasks,
    fetchCategory,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    handleEdit,
    clearFilters,
  } = useTodoList();

  useEffect(() => {
    if (!task.category) {
      setTask((prev) => ({ ...prev, category: GENERAL_ID }));
    }
  }, [task.category, setTask]);

  const selectedCategory = useMemo(() => {
    if (!task.category || !task_category_option.includes(task.category)) {
      return GENERAL_ID;
    }
    return task.category;
  }, [task.category, task_category_option]);

  const filterSelectedCategory = useMemo(() => {
    if (!filter_category || filter_category === "All") return "All";
    return task_category_option.includes(filter_category)
      ? filter_category
      : "All";
  }, [filter_category, task_category_option]);

  // ❌ ลบฟังก์ชัน handleTemplateClick ออกไป

  const getCategoryDisplayName = (categoryId: string) => {
    if (categoryId === GENERAL_ID) return "General";
    if (categoryId === "All") return "All Categories"; // เพิ่มสำหรับ Filter "All"
    return categoryId;
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <UpdateTask
          open={open_update}
          onClose={() => setOpenUpdate(false)}
          onRefresh={fetchTasks}
          task_id={selected_task_id}
        />
        <ManageCategory
          open={open_manage_category}
          onClose={() => {
            fetchCategory();
            setOpenManageCategory(false);
          }}
          onRefresh={fetchTasks}
        />
        <header className="flex justify-between items-center border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <ListTodo className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              ToDo List
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
          </div>
        </header>
        <section className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 border border-gray-800 bg-gray-900 shadow-xl rounded-none">
            <CardHeader className="pb-3 border-b border-gray-800">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-white">
                <Plus className="h-5 w-5 text-primary" />
                Add New Action Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* ส่วน Input Form */}
              <div className="space-y-3">
                <Input
                  id="new-task"
                  placeholder="Task Description (100 char limit)..."
                  value={task.text}
                  maxLength={100}
                  onChange={(event) =>
                    setTask({ ...task, text: event.target.value })
                  }
                  onKeyUp={(event) => {
                    if (event.key === "Enter") {
                      addTask();
                    }
                  }}
                  className="rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-primary/50 bg-gray-900 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 pt-1">
                  <span>{(task.text ?? "").length}/100</span>
                  <span className="text-primary/70">Enter to submit</span>
                </div>
              </div>

              {/* ส่วน Category Select และ Button */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
                <div className="flex gap-2 items-end w-full sm:w-1/3">
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="task-category"
                      className="text-sm font-medium text-gray-400"
                    >
                      Category
                    </Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) =>
                        setTask((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger
                        id="task-category"
                        className="rounded-none border border-gray-700 bg-gray-800 text-white hover:border-primary/50"
                      >
                        <SelectValue>
                          {getCategoryDisplayName(selectedCategory)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-none border border-gray-700 bg-gray-800 text-white">
                        <SelectItem key={GENERAL_ID} value={GENERAL_ID}>
                          General
                        </SelectItem>
                        {task_category_option
                          .filter((option) => option !== GENERAL_ID)
                          .map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => setOpenManageCategory(true)}
                    className="h-10 px-4 shrink-0 rounded-none border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-primary flex items-center gap-2"
                    title="Add Categories"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                <Button
                  type="button"
                  size="icon"
                  onClick={addTask}
                  className="w-full sm:w-auto gap-2 rounded-none border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-primary font-semibold px-6 py-2 h-10"
                >
                  <Plus className="h-4 w-4" />
                  Commit Task
                </Button>
              </div>
              {/* ❌ ลบส่วน Quick Templates ออกจากที่นี่ */}
            </CardContent>
          </Card>
          <Card className="border border-gray-800 bg-gray-900 shadow-xl rounded-none flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-800 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                Completed Log
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCompleted(!show_completed)}
                className="gap-2 rounded-none text-gray-400 hover:bg-gray-800"
              >
                {show_completed ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show ({completed_tasks.length})
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              {/* 💡 เปลี่ยนมาใช้ recentCompletedTasks ที่ถูกจำกัดไว้แล้ว */}
              {show_completed && completed_tasks.length > 0 ? (
                // 💡 เปลี่ยน max-h-[440px] เป็น max-h-[190px] เพื่อแสดงแค่ 3 รายการ + Scrollbar
                <ScrollArea className="h-[220px] pr-3">
                  <div className="space-y-3">
                    {/* 💡 ใช้ completed_tasks เพื่อให้รายการทั้งหมดเลื่อนได้ */}
                    {completed_tasks.map((t) => (
                      <div
                        key={t.task_id}
                        className="flex items-start gap-4 p-3 border-l-4 border-emerald-500 bg-gray-800/50 hover:bg-gray-800 transition"
                      >
                        <Checkbox
                          checked={t.completed}
                          onCheckedChange={(checked) =>
                            toggleTaskCompletion(t.task_id, Boolean(checked))
                          }
                          className="mt-1 h-5 w-5 rounded-none border-emerald-500 bg-gray-900 data-[state=checked]:bg-emerald-500"
                        />
                        <div className="flex-1 space-y-1">
                          <h3
                            className="text-sm font-light text-emerald-300 line-through"
                            title={t.text}
                          >
                            {t.text}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>
                              Completed: {formatDate(t.completedAt, "dd/MM/yy")}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(t.task_id)}
                          className="rounded-none text-gray-600 hover:bg-red-900/30 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center text-gray-700">
                  <CheckCircle2 className="h-10 w-10 text-emerald-900" />
                  <p className="text-sm font-medium">
                    {completed_tasks.length === 0
                      ? "No tasks completed yet."
                      : "Log is hidden. Click 'Show' to review."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <ListFilter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
              Active Filters:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-none border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800"
                >
                  <Settings2 className="h-3 w-3" />
                  {/* ********** ส่วนที่แก้ไข ********** */}
                  {`Category: ${getCategoryDisplayName(filterSelectedCategory)}`}
                  {/* ******************************** */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 rounded-none border border-gray-700 bg-gray-800 text-white"
              >
                <DropdownMenuItem
                  onSelect={() => setFilterCategory("All")}
                  className={`${filterSelectedCategory === "All"
                      ? "text-primary font-bold bg-gray-700"
                      : ""
                    }`}
                >
                  All Categories
                </DropdownMenuItem>
                <div className="border-t border-gray-700 my-1"></div>
                {Array.from(new Set([GENERAL_ID, ...task_category_option]))
                  .map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onSelect={() => setFilterCategory(option)}
                      className={`flex items-center justify-between ${option === filterSelectedCategory
                          ? "text-primary font-bold"
                          : ""
                        }`}
                    >
                      {getCategoryDisplayName(option)}
                      {option === filterSelectedCategory && (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {(filterSelectedCategory !== "All" ||
              search_query.trim() !== "") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 rounded-none text-red-400 hover:bg-red-900/30"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              )}
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold border-b border-primary/50 pb-2 text-white">
                <span className="text-primary">{incomplete_tasks.length}</span>{" "}
                Pending Tasks
              </h2>
              {loading ? (
                <div className="flex min-h-[300px] items-center justify-center border border-gray-800 bg-gray-900">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : incomplete_tasks.length > 0 ? (
                <ScrollArea className="h-full max-h-[500px] pr-3">
                  <div className="space-y-3">
                    {incomplete_tasks.map((t) => (
                      <div
                        key={t.task_id}
                        className="flex items-start gap-4 p-3 border-l-4 border-primary bg-gray-800 hover:bg-gray-700 transition"
                      >
                        <Checkbox
                          checked={t.completed}
                          onCheckedChange={(checked) =>
                            toggleTaskCompletion(t.task_id, Boolean(checked))
                          }
                          className="mt-1 h-5 w-5 rounded-none border-primary data-[state=checked]:bg-primary"
                        />
                        <div className="flex-1 space-y-1">
                          <h3
                            className="text-base font-medium text-white"
                            title={t.text}
                          >
                            {t.text}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <Badge
                              variant="secondary"
                              className="text-xs rounded-none bg-primary/10 text-primary border-primary/50"
                            >
                              {t.category || "UNCATEGORIZED"}
                            </Badge>
                            <span>
                              Created: {formatDate(t.createdAt, "dd MMM yyyy")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(t.task_id)}
                            className="rounded-none text-gray-400 hover:bg-primary/20 hover:text-primary"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(t.task_id)}
                            className="rounded-none text-red-400 hover:bg-red-900/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center text-gray-500 border border-gray-800 bg-gray-900">
                  <Star className="h-10 w-10 text-primary/40" />
                  <p className="text-lg font-medium">No active tasks found.</p>
                  <p className="text-sm">Start by adding a new task above.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TodoListPage;