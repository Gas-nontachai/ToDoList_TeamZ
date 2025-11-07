"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogVariant = "default" | "destructive";

type ConfirmDialogOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
};

type ConfirmDialogContextValue = (
  options: ConfirmDialogOptions
) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(
  null
);

type Resolver = (value: boolean) => void;

type PendingDialog = ConfirmDialogOptions & {
  resolve: Resolver;
};

export const ConfirmDialogProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [pendingDialog, setPendingDialog] = useState<PendingDialog | null>(
    null
  );

  const closeDialog = useCallback(
    (value: boolean) => {
      if (pendingDialog) {
        pendingDialog.resolve(value);
        setPendingDialog(null);
      }
    },
    [pendingDialog]
  );

  const confirm = useCallback<ConfirmDialogContextValue>(
    (options) =>
      new Promise<boolean>((resolve) => {
        setPendingDialog({ ...options, resolve });
      }),
    []
  );

  const contextValue = useMemo(() => confirm, [confirm]);

  const open = Boolean(pendingDialog);

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}
      <AlertDialog open={open}>
        <AlertDialogContent className="rounded-none border border-gray-700 bg-gray-900 p-0">
          <AlertDialogHeader className="space-y-2 border-b border-gray-700 bg-gray-900 px-6 py-5">
            <AlertDialogTitle className="text-xl font-bold text-white">
              {pendingDialog?.title}
            </AlertDialogTitle>
            {pendingDialog?.description ? (
              <AlertDialogDescription className="text-sm leading-relaxed text-gray-400">
                {pendingDialog.description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-gray-700 bg-gray-800 px-6 py-4">
            <AlertDialogCancel
              onClick={() => closeDialog(false)}
              className="rounded-none border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              {pendingDialog?.cancelText ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => closeDialog(true)}
              className={`rounded-none font-semibold border ${
                pendingDialog?.variant === "destructive"
                  ? "border-red-700 bg-red-900/30 text-red-400 hover:bg-red-900/50"
                  : "border-gray-700 bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {pendingDialog?.confirmText ?? "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmDialog must be used within a ConfirmDialogProvider"
    );
  }
  return context;
};