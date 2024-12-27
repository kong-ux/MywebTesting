"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ใช้ useRouter เพื่อจัดการ redirect
import { LoginformDialg } from "@/components/loging-component/crad-Dialog";

export default function LoginPage() {
  const [open, setOpen] = useState(true); // เปิด Dialog โดยค่าเริ่มต้น
  const router = useRouter(); // ใช้ useRouter สำหรับการเปลี่ยนหน้า
  const handleDialogClose = (isOpen) => {
    setOpen(isOpen); // อัปเดต state
    if (!isOpen) {
      router.push("/"); // Redirect ไปยังหน้าแรก
    }
  };

  return (
    <div>
      <LoginformDialg open={open} setOpen={handleDialogClose} />
    </div>
  );
}
