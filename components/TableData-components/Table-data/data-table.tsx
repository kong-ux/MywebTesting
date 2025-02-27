"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableRowActions } from "./data-table-row-actions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    UserAdminName: false,
    FK_BookID: false,
    ServiceNote: false,
    Repair_ID: false,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "ServiceDate", desc: true },
  ]);

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
    rowData: any | null;
    open: boolean;
  }>({ mouseX: 0, mouseY: 0, rowData: null, open: false });

  const tableRef = React.useRef<HTMLDivElement>(null);

  const handleContextMenu = (event: React.MouseEvent, row: any) => {
    event.preventDefault();
    
    // ดึงค่าตำแหน่งของเมาส์จากหน้าจอ
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    setContextMenu({
      mouseX,
      mouseY,
      rowData: row.original,
      open: true,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, open: false });
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div ref={tableRef} className="space-y-4 m-8 m-auto relative" onClick={closeContextMenu}>
      <DataTableToolbar  table={table} />
      <div className="overflow-y-auto rounded-md border">
        <DataTablePagination table={table} />
        <Table>
          <TableHeader className="bg-primary/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="px-4 py-2" key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onContextMenu={(e) => handleContextMenu(e, row)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-2" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  ไม่พบข้อมูล.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      

      {contextMenu.open && contextMenu.rowData && (
        <DataTableRowActions
          row={contextMenu.rowData}
          mouseX={contextMenu.mouseX}
          mouseY={contextMenu.mouseY}
          closeMenu={closeContextMenu}
        />
      )}
    </div>
  );
}
