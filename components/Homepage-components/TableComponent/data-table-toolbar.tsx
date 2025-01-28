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

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [typeBooks, setTypeBooks] = useState([]);
  const [addressBooks, setAddressBooks] = useState([]);
  const [status, setStatus] = useState([]);
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const [dateColumn, setDateColumn] = useState("ServiceDate");

  useEffect(() => {
    async function fetchData() {
      try {
        const { type_books, address_book ,status } = await fetchTypeBooks_AddressBook();
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
    table.getColumn(dateColumn)?.setFilterValue([from, to]);
  };

  const toggleDateColumn = () => {
    setDateColumn((prev) => (prev === "ServiceDate" ? "StatusDate" : "ServiceDate"));
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="ค้นหาชื่อหนังสือ...."
          value={(table.getColumn("Bookname")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("Bookname")?.setFilterValue(event.target.value);
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
        <Button
          variant="outline"
          onClick={toggleDateColumn}
        >
          เปลียนวัน: ({dateColumn === "ServiceDate" ? "StatusDate" : "ServiceDate"})
        </Button>
        <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="h-9 w-[]"
          variant="outline"
        />
      </div>

      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}