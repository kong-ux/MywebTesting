
"use client"
import { useState } from "react";
import { ServiceForm } from "@/components/Service-from-components/form-components";
import CreateFormService from "@/components/Service-from-components/Insert_Form_Service";
import { Button } from "@/components/ui/button";
const Page = () => {
  const [formData, setFormData] = useState<any>(null);

  const getdataform = (data: any) => {
    console.log("Data received:", data);
    setFormData(data); // เก็บ data ที่ได้จาก ServiceForm
  };

  return (
    <div className="flex w-full h-full ">
        <div className=" p-6 w-2/4 ">
          <h1 className="mb-4 text-3xl font-extrabold" 
          >เพิ่มรายการ</h1>
          <p className="mb-6 text-lg font-normal "
          >กรอกรหัส Barcode หนังชือ</p>
          <ServiceForm  OutputData={getdataform}/>
        </div>
          <div className="w-full border-l border-r border-gray-200  overflow-y-auto h-screen">
            <div className="flex items-center right bg-card/60 backdrop-blur p-3 sticky top-0">
              <Button>UPLAOD</Button>
            </div>

            <div className=" h-full p-6">
              <CreateFormService data={formData} />
            </div>
          </div>

      </div>

  )
  };


  export default Page;

  