"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { status_book, type_books } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import { CircleFadingArrowUp } from "lucide-react";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Filter table data based on selected date range
    table.getColumn("StatusDate")?.setFilterValue([from, to]);
  };

  const handleClick = () => {
    const selectedRows = table.getFilteredSelectedRowModel().flatRows.map(row => row.original);
    console.log(selectedRows);

    sessionStorage.setItem("selectedRows", JSON.stringify(selectedRows));

    // นำทางไปยังหน้า Update-service
    window.location.href = "/Table/Update-service"; // หรือใช้ window.location.assign("/Update-service")
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter labels..."
          value={(table.getColumn("Book_Name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("Book_Name")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("Typ_Book") && (
          <DataTableFacetedFilter
            column={table.getColumn("Typ_Book")}
            title="ชนิดหนังสือ"
            options={type_books}
          />
        )}
        {table.getColumn("Status_Name") && (
          <DataTableFacetedFilter
            column={table.getColumn("Status_Name")}
            title="สถาณ"
            options={status_book}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="h-9 w-[250px]"
          variant="outline"
        />
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick} 
          >
            <CircleFadingArrowUp className="mr-2 size-4" aria-hidden="true" />
            อัพเดทสถาณะ ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}