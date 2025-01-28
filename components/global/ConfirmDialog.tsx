"use client"
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
import { Button } from "@/components/ui/button";
import React, { createContext, useState, ReactNode } from "react";

interface AlertContextProps {
  showAlert: (title: string, description: string, confirmText?: string, callback?: () => void) => void;
}

const ConfrimContext = createContext<AlertContextProps | undefined>(undefined);

export function ConfirmDialog({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [alertConfirmText, setAlertConfirmText] = useState("OK");
  const [callback, setCallback] = useState<(() => void) | undefined>(undefined);

  const showAlert = (title: string, description: string, confirmText = "OK", callback?: () => void) => {
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertConfirmText(confirmText);
    setCallback(() => callback);
    setIsOpen(true);
  };

  const confirmsubmit = () => {
    setIsOpen(false);
    if (callback) {
      callback();
    }
  };

  const close = () => {
    setIsOpen(false);
  }
  return (
    <ConfrimContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={close}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmsubmit}>{alertConfirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfrimContext.Provider>
  );
}

export default ConfrimContext;

