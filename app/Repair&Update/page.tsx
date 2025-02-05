"use client";
import { useState } from "react";
import { ServiceForm } from "@/components/Repair&Upadate-components/form-components";
import CreateFormService from "@/components/Repair&Upadate-components/Insert_Form_Service";
// import { ServiceForm } from "@/components/Report-from-components/form-components";
// import CreateFormService from "@/components/Report-from-components/Insert_Form_Service";
import SheetTriggerButton from "@/components/Repair&Upadate-components/SheetDoc";

const Page = () => {
  const [formData, setFormData] = useState<any>(null);

  const getdataform = (data: any) => {
    console.log("Data received:", data);
    setFormData(data); // เก็บ data ที่ได้จาก ServiceForm
  };

  // Log formData after it has been updated
  console.log("FormData received:", formData);

  return (
    <div className="flex w-full h-screen ">
      <div className="p-6 w-2/4">
        <h1 className="mb-4 text-3xl font-extrabold">ทำรายการ</h1>
        <div className="flex space-x-4">
          <p className="mb-6 text-lg font-normal">กรอกรหัส Barcode หนังสือ</p>
          <SheetTriggerButton />
        </div>

        <ServiceForm OutputData={getdataform} />
      </div>
      <div className="w-full border-l border-gray-200 ">
        <div className="p-8 ">
          <CreateFormService key={JSON.stringify(formData)} data={formData} />
        </div>
      </div>
    </div>
  );
};

export default Page;
