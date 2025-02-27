"use client";
import { useState } from "react";
import { ReportForm } from "@/components/Report-component/Report-form-component";
import { DataTable } from "@/components/Report-component/table";
import { Button } from "@/components/ui/button";
import { Summary } from "@/components/Report-component/Summary";
import {XportFilter} from "@/components/Report-component/exportfilter";
import { generatePDF } from "@/lib/pdf"; // Update the import path

const Page = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showSummary, setShowSummary] = useState(false); // Add state for toggling

  const handleFilteredData = (data: any[]) => {
    setFilteredData(data);
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
                  <XportFilter filteredData={filteredData} />
                  <Button variant={"outline"} onClick={toggleSummary}>
                    {showSummary ? "แสดงรายการ" : "ค่าสถิติ"}
                  </Button>
                  <Button variant={"outline"} onClick={() => generatePDF(filteredData)}>
                    ส่งออก PDF
                  </Button>
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
