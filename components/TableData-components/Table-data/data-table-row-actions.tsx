"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useConfirmDialog } from "@/hooks/use-alert";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const deleteRow = async(row: Row<any>) => {
  const data = {
    Repair_ID: row.original.Repair_ID, 
    BookQR: row.original.BookQR
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
  } catch (error) {
    console.error("Upload Error:", error.message);
    throw error;
  }
};

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const { showAlert } = useConfirmDialog();
  // const task = taskSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* <DropdownMenuItem>แสดงสถาณะเพิ่มเติม</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => showAlert(
          "คำเตือน", 
          "ถ้าทำการลบข้อมูลจะไม่สามารถกู้คืนได้และหนังสือจะทำอัพเดทสถาณะของหนังสือเป็นออกจำหนายแล้ว", 
          "Yes", 
          () => deleteRow(row)
        )}>
          ลบข้อมูล 
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem> 
      </DropdownMenuContent>
    </DropdownMenu>
  );
}