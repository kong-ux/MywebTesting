"use client";
import { useState } from "react";
import { ReportForm } from "@/components/Report-component/Report-form-component";
import { DataTable } from "@/components/Report-component/table";
import { Button } from "@/components/ui/button";
import { Summary } from "@/components/Report-component/Summary";
import { DownloadExcel } from "@/lib/xlsx"; // Import the DownloadExcel function
import {XportFilter} from "@/components/Report-component/exportfilter";

const Page = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showSummary, setShowSummary] = useState(false); // Add state for toggling

  const handleFilteredData = (data: any[]) => {
    setFilteredData(data);
  };

  const handleDownloadExcel = () => {
    DownloadExcel(filteredData);
  };

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  return (
    <div className="w-full ">
      <div className="p-6 w-full">
        <h1 className="mb-4 text-3xl font-extrabold">รายงานทรัพยากร</h1>
        <ReportForm onFilteredData={handleFilteredData} />
      </div>
      <div className="w-full border-l border-gray-200">
        <div className="p-8 w-full">
          <div className="flex space-x-4">
            <h1 className="text-3xl font-extrabold">รายการ</h1>
            <div className="flex space-x-4">
              {filteredData.length > 0 && (
                <>
                  <Button variant={"outline"} onClick={handleDownloadExcel}>
                    Export to Excel
                  </Button>
                  <Button variant={"outline"} onClick={toggleSummary}>
                    {showSummary ? "แสดงรายการ" : "ค่าสถิติ"}
                  </Button>
                  <XportFilter />
                </>
              )}
            </div>
          </div>
          <div className="p-4 w-full">
            {showSummary ? (
              <Summary data={filteredData} />
            ) : (
              filteredData.length > 0 && <DataTable data={filteredData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
