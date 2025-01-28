"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Formlogin from "./login-form";
import { useState, useEffect } from "react";

const LoginformDialog = ({ state, onClose }: { state: boolean, onClose: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(state);
  }, [state]);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เข้าสู่ระบบ</DialogTitle>
          <DialogDescription>เข้าสู่ระบบเพื่อใช้งาน</DialogDescription>
        </DialogHeader>
        <Formlogin />
      </DialogContent>
    </Dialog>
  );
};

export default LoginformDialog;