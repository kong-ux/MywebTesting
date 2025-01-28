"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "./schema";
import { DataTableColumnHeader } from "./data-table-column-header";




export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "Book_ID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="รหัสส่งหนังสือ" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("Book_ID")}</div>
    ),


  },
  {
    accessorKey: "Bookname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ชื่อหนังสือ" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("Bookname")}</div>
    ),
  },
  {
    accessorKey: "BookType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ชนิดหนังสือ" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("BookType")}</div>
    ),
  },
  {
    accessorKey: "Bookaddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="สถาณที่" />
    ),  
    cell: ({ row }) => (
      <div className="">{row.getValue("Bookaddress")}</div>
    ),
  },
  {
    accessorKey: "Service",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="บริการ" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="capitalize"> {row.getValue("Service")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "ServiceDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="วันที่บริการ" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("ServiceDate"));
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    accessorKey: "StatusName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="สถาณะ" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="">
            {row.getValue("StatusName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "StatusDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="วันที่สถานะ" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("StatusDate"));
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
];