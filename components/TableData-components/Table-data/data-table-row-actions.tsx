"use client";

import { useConfirmDialog } from "@/hooks/use-alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: TData;
  mouseX: number;
  mouseY: number;
  closeMenu: () => void;
}
const deleteRow = async (row: any) => {
  const data = {
    Repair_ID: row.Repair_ID, 
    BookQR: row.BookQR,
  };
  try {
    const response = await fetch(`/api/Del_Row`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Error Response:", errorMessage);
      throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
    }

    const result = await response.json();
    console.log("Result:", result);

    window.location.reload();
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    throw error;
  }
};
export function DataTableRowActions<TData>({
  row,
  mouseX,
  mouseY,
  closeMenu,
}: DataTableRowActionsProps<TData>) {
  const { showAlert } = useConfirmDialog();

  return (
    <DropdownMenu open={true} onOpenChange={closeMenu}>
      <DropdownMenuContent
        align="start"
        className="w-[160px] absolute z-50 shadow-md bg-white rounded-md"
        style={{
          top: `${mouseY}px`,
          left: `${mouseX}px`,
          position: "absolute",
        }}
        onClick={(e) => e.stopPropagation()} // ป้องกันการปิดเมื่อคลิกในเมนู
      >
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          ตรวจสอบข้อมูล
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            showAlert(
              "คำเตือน",
              "ถ้าทำการลบข้อมูลจะไม่สามารถกู้คืนได้และหนังสือจะทำอัพเดทสถาณะของหนังสือเป็นออกจำหน่ายแล้ว",
              "Yes",
              () => deleteRow(row)
            )
          }
        >
          ลบข้อมูล
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
