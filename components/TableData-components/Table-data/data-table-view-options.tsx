"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,

  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id === "index" && "ลำดับ"}
                {column.id === "Repair_ID" && "รหัสรายการซ่อม"}
                {column.id === "UserAdminName" && "ผู้ทำราการ"}
                {column.id === "BookQR" && "รหัสบาร์โค้ด"}
                {column.id === "FK_BookID" && "รหัสหนังสือ"}
                {column.id === "Bookname" && "ชื่อหนังสือ"}
                {column.id === "BookType" && "ชนิดหนังสือ"}
                {column.id === "Bookaddress" && "สถาณที่"}
                {column.id === "Bookstate" && "สถาณะหนังสือ"}
                {column.id === "ServiceNote" && "บริการ"}
                {column.id === "ServiceByName" && "บริการเพิ่มเติม"}
                {column.id === "ServiceDate" && "ชื่อผู้แจ้ง"}
                {column.id === "StatusName" && "วันที่บริการ"}
                {column.id === "StatusDate" && "สถาณะ"}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}