import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * อินเทอร์เฟซสำหรับพร็อพของ DataTablePagination
 * @template TData - ประเภทของข้อมูลในตาราง
 */
interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

/**
 * คอมโพเนนต์สำหรับการแบ่งหน้าในตารางข้อมูล
 * @template TData - ประเภทของข้อมูลในตาราง
 * @param {DataTablePaginationProps<TData>} props - พร็อพของคอมโพเนนต์
 * @returns {JSX.Element} - องค์ประกอบ JSX ของการแบ่งหน้าในตารางข้อมูล
 */
export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const totalRows = table.getCoreRowModel().rows.length; // รับจำนวนแถวทั้งหมดสำหรับตัวเลือก "All"

  return (
    <div className="flex flex-col items-center justify-between space-y-4 px-2 lg:flex-row lg:space-y-0 bg-primary/5">
      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">จำนวนแถวต่อหน้า</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(value === "All" ? totalRows : Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[6, 10, 20, 30, 40, 50, "All"].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center text-sm font-medium">
          หน้าที่ {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">ไปที่หน้าแรก</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">ไปที่หน้าก่อนหน้า</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">ไปที่หน้าถัดไป</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">ไปที่หน้าสุดท้าย</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
