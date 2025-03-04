"use client"

import React, { createContext, useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertContextProps {
  showAlert: (title: string, description: string, cancelText?: string, callback?: () => void) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [alertCancelText, setAlertCancelText] = useState("OK");
  const [callback, setCallback] = useState<(() => void) | undefined>(undefined);

  const showAlert = (title: string, description: string, cancelText = "OK", callback?: () => void) => {
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertCancelText(cancelText);
    setCallback(() => callback);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
    if (callback) {
      callback();
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={closeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{alertCancelText}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
};

export default AlertContext;
