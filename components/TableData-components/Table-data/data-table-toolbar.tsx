"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { useState, useEffect } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import fetchTypeBooks_AddressBook from "./data";
import { CircleFadingArrowUp } from "lucide-react";
import { DownloadExcel } from "@/lib/xlsx";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  setGlobalFilter: (filterValue: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  const [typeBooks, setTypeBooks] = useState([]);
  const [addressBooks, setAddressBooks] = useState([]);
  const [status, setStatus] = useState([]);
  const isFiltered = table.getState().columnFilters.length > 0;
  const exportdata = () => {
    const visibleColumns = table
      .getAllColumns()
      .filter(
        (column) =>
          column.getIsVisible() &&
          column.id !== "select" &&
          column.id !== "actions"
      );
    const data = table.getFilteredSelectedRowModel().rows.map((row) => {
      const rowData = row.original;
      if (!rowData) return {};
      const filteredData: { [key: string]: any } = {};
      visibleColumns.forEach((column) => {
        let value = rowData[column.id];
        if (
          column.id !== "Repair_ID" &&
          (value instanceof Date || !isNaN(Date.parse(value)))
        ) {
          const date = new Date(value);
          value = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        }
        filteredData[column.id === "Repair_ID" ? "RepairID" : column.id] =
          value;
      });
      return filteredData;
    });
    console.log("DownloadExcel", data);
    DownloadExcel(data);
  };
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { type_books, address_book, status } =
          await fetchTypeBooks_AddressBook();
        setTypeBooks(type_books);
        setAddressBooks(address_book);
        setStatus(status);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }
    fetchData();
  }, []);

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("ServiceDate")?.setFilterValue([from, to]);
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="ค้นหาหนังสือด้วยชื่อ, QR หรือ ID..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => {
            setGlobalFilter(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("BookType") && (
          <DataTableFacetedFilter
            column={table.getColumn("BookType")}
            title="ชนิดหนังสือ"
            options={typeBooks}
          />
        )}
        {table.getColumn("Bookaddress") && (
          <DataTableFacetedFilter
            column={table.getColumn("Bookaddress")}
            title="สถาณที่"
            options={addressBooks}
          />
        )}
        {table.getColumn("StatusName") && (
          <DataTableFacetedFilter
            column={table.getColumn("StatusName")}
            title="สถาณะ"
            options={status}
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
          className=""
          variant="outline"
        />
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button variant="outline" size="sm" onClick={exportdata}>
            <CircleFadingArrowUp className="mr-2 size-4" aria-hidden="true" />
            ExportExcel ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
