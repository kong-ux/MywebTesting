"use client"
import { useContext } from "react";
import AlertContext from "@/components/global/AlertDialog";
import ConfrimContext  from "@/components/global/ConfirmDialog";
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const useConfirmDialog = () => {
  const context = useContext(ConfrimContext);
  if (!context) {
    throw new Error("useConfirmDialog must be used within an AlertProvider");
  }
  return context;
};