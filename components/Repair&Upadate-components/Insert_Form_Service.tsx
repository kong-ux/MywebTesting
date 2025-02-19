import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAlert } from "@/hooks/use-alert";
import { Skeleton } from "@/components/ui/skeleton"

import { Select, SelectTrigger, SelectValue ,SelectContent, SelectItem} from "../ui/select";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RepairDoc {
  Repair_ID: string;
  FK_User_ID: string;
  FK_BookID: string;
  BookQR: string;
  BookID: string;
  Bookname: string;
  BookType: string;
  Bookaddress: string;
  Bookstate: string;
  ServiceByName: string;
  Service: string;
  ServiceNote: string;
  ServiceDate: string;
  StatusName: string;
  StatusDate: string;
}

interface ItemData {
  data: RepairDoc;
}

const Create_Form_Service = ({ data }: { data: ItemData[] | null }) => {
  const [formData, setFormData] = useState<ItemData[]>(data || []);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [selectedService, setSelectedService] = useState<{ [key: number]: string }>({});
  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});
  const currentDatetime = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Bangkok",
    hour12: false,
  }).replace(" ", "T").slice(0, 16); // Ensure correct format for datetime-local input
  const { showAlert } = useAlert(); // Destructure showAlert from the context

  useEffect(() => {
    if (data) {
      setFormData(data);
      console.log("formData:", formData);
      const initialServices: { [key: number]: string } = {};
      const initialStatuses: { [key: number]: string } = {}; // Add this line
      data.forEach((item, index) => {
        initialServices[index] = getServiceValue(item.data.Service);
        initialStatuses[index] = item.data.StatusName; // Add this line
      });
      setSelectedService(initialServices);
    }
  }, [data]);

  const handleServiceChange = (index: number, value: string) => {
    setSelectedService((prev) => ({ ...prev, [index]: value }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`Service${index}`];
      return newErrors;
    });
  };

  const handleStatusChange = (index: number, value: string) => {
    setSelectedStatus((prev) => ({ ...prev, [index]: value }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`StatusName${index}`];
      return newErrors;
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (value) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    console.log("submit");
    const formElements = e.target as HTMLFormElement;
    const newErrors: { [key: string]: boolean } = {};
    let hasErrors = false;
    const alertContext: string[] = [];

    formData.forEach((_, index) => {
      const service = selectedService[index];
      const status = selectedStatus[index];
      console.log("ตรวจservice:", service)

      if (!service) {
        newErrors[`Service${index}`] = true;
        hasErrors = true;
        alertContext.push(`ช่อง Service อันที่ ${index + 1} เป็นค่าว่าง  `);
      }

      if (!status) {
        newErrors[`StatusName${index}`] = true;
        hasErrors = true;
        alertContext.push(`ช่อง StatusName อันที่ ${index + 1} เป็นค่าว่าง`);
      }

      if (service === "อื่นๆ" && !formElements[`Service${index}`].value) {
        newErrors[`Service${index}`] = true;
        hasErrors = true;
        alertContext.push(`ช่อง Service อันที่ ${index + 1} เป็นค่าว่าง`);
      }

      ["ServiceDate", "StatusDate"].forEach((field) => {
        const fieldId = `${field}${index}`;
        const formElement = formElements[fieldId];
        if (!formElement || !formElement.value) {
          newErrors[fieldId] = true;
          hasErrors = true;
          alertContext.push(`ช่อง ${field} อันที่ ${index + 1} เป็นค่าว่าง`);
        }
      });
    });

    if (hasErrors) {
      setErrors(newErrors);
      showAlert("ไม่สามารถสร้างได้", alertContext.join("\n"), "Close");
      setIsLoading(false); 
      return;
    }

    const submittedData = formData.map((item, index) => {
      const Repair_ID = item.data.Repair_ID; 
      const service = selectedService[index] === "อื่นๆ" ? formElements[`Service${index}`].value : selectedService[index];
      const serviceNote = formElements[`ServiceNote${index}`].value;
      const serviceDate = formElements[`ServiceDate${index}`].value;
      const status = selectedStatus[index];
      const StatusDate = formElements[`StatusDate${index}`].value;

      return {
        Repair_ID: Repair_ID,
        service: service,
        serviceNote: serviceNote,
        serviceDate: serviceDate,
        status: status,
        StatusDate: StatusDate
      };
    });
    console.log("Submitted form data:", submittedData);

    // API UPLOAD
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Repair&Update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submittedData),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Error Response:", responseData);
      showAlert("ทำการผิดพลาด", responseData.message, "OK");
    }
    if (response.status === 200) {
      showAlert("สำเร็จ", responseData.message, "OK", () => {
        window.location.reload();
      });
    } else {
      console.log("responseData", responseData);
      showAlert("ไม่สำเร็จ", responseData.message, "OK");
    }

    setIsLoading(false); 
  };

  const getServiceValue = (service: string) => {
    if (service === "รับเรื่องแจ้งแล้ว") {
      return "";
    }
    const options = [
      "หนังสือชำรุด",
      "ไม่พบข้อมูลหนังสือ",
      "หนังสือหาย",
      "แก้ไขระเบียนบรรณานุกรมหนังสือ",
      "บาร์โค้ดผิด/ชำรุด",
    ];
    return options.includes(service) ? service : "อื่นๆ";
  };

  if (!formData.length || formData == undefined || formData == null) {
    return (
      <>
      กรุณากรอกข้อมูลก่อน
      <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px]rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[500px]" />
      </div>
    </div>
    </>
    )
  } else {
    return (
      <>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="w-full flex justify-end mb-4">
            <Button
              className="w-25 h-12 mr-8"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
          {formData.map((item, index) => {
            const formcolum = item.data;
            return (
              <Card key={index} className="my-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    รายการที่ {formcolum.Repair_ID}
                  </CardTitle>
                  <div className="flex space-x-16 text-lg font-bold">
                    <p>รหัส QRCODE: {formcolum.BookQR}</p>
                    <p>รหัส หนังสือ: {formcolum.BookID}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-lg font-bold">ชื่อหนังสือ</Label>
                    <p>&nbsp;{formcolum.Bookname}</p>
                  </div>
                  <div>
                    <Label className="text-lg font-bold">ประเภททรัพยากร</Label>
                    <p>&nbsp;{formcolum.BookType}</p>
                  </div>
                  <div>
                    <Label className="text-lg font-bold">สถานที่จัดเก็บ</Label>
                    <p>&nbsp;{formcolum.Bookaddress}</p>
                  </div>
                  <div className="flex space-x-24">
                    <div>
                      <Label className="text-lg font-bold">สถานะทรัพยากร</Label>
                      <p>&nbsp;{formcolum.Bookstate}</p>
                    </div>
                    <div>
                      <Label className="text-lg font-bold">ชื่อผู้แจ้ง</Label>
                      <p>&nbsp;{formcolum.ServiceByName}</p>
                    </div>
                  </div>
                  <div className="flex space-x-8 border-white border-t-2">
                    <div>
                      <Label className="text-lg font-bold">เรื่องแจ้ง</Label>
                      <div className="flex">
                        <Select
                          defaultValue={getServiceValue(formcolum.Service)}
                          onValueChange={(value) => handleServiceChange(index, value)}
                        >
                          <SelectTrigger className={errors[`Service${index}`] ? "border-red-500" : ""}>
                            <SelectValue placeholder="เลือกเรื่องที่อัพเดท" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="หนังสือชำรุด">หนังสือชำรุด</SelectItem>
                            <SelectItem value="ไม่พบข้อมูลหนังสือ">ไม่พบข้อมูลหนังสือ</SelectItem>
                            <SelectItem value="หนังสือหาย">หนังสือหาย</SelectItem>
                            <SelectItem value="แก้ไขระเบียนบรรณานุกรมหนังสือ">แก้ไขระเบียนบรรณานุกรมหนังสือ</SelectItem>
                            <SelectItem value="บาร์โค้ดผิด/ชำรุด">บาร์โค้ดผิด/ชำรุด</SelectItem>
                            <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                          </SelectContent>
                        </Select>
                        {selectedService[index] === "อื่นๆ" && (
                          <Input
                            type="text"
                            defaultValue={formcolum.Service === "รับเรื่องแจ้งแล้ว" ? "" : formcolum.Service}
                            placeholder={formcolum.Service === "รับเรื่องแจ้งแล้ว" ? "กรอกเรื่องแจ้ง" : formcolum.Service}
                            id={`Service${index}`}
                            className={errors[`Service${index}`] ? "border-red-500" : ""}
                            onChange={handleInputChange}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-lg font-bold">เพิ่มเติม</Label>
                      <Input placeholder="จะกรอกหรือไม่กรอกก็ได้" 
                      id={`ServiceNote${index}`}
                      className={errors[`ServiceNote${index}`] ? "border-red-500" : ""}
                      defaultValue={formcolum.ServiceNote === null ? "" : formcolum.ServiceNote}
                      onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ServiceDate${formcolum.Repair_ID}`} className="text-lg font-bold">วันที่</Label>
                      <Input
                        type="datetime-local"
                        id={`ServiceDate${index}`}
                        defaultValue={currentDatetime}
                        className={errors[`ServiceDate${index}`] ? "border-red-500" : ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-8">
                    <div>
                      <Label className="text-lg font-bold">อัพเดทสะถาณะ</Label>
                      <div className="flex">
                        <Select
                        onValueChange={(value) => handleStatusChange(index, value)}
                        >
                          <SelectTrigger className={errors[`StatusName${index}`] ? "border-red-500" : ""}>
                            <SelectValue placeholder="เลือกเรื่องที่อัพเดท" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">อยู่ระหว่างการดำเนินการ</SelectItem>
                            <SelectItem value="3">อยู่ระหว่างการซ่อม</SelectItem>
                            <SelectItem value="4">สือหายซื้อเล่มใหม่ทดแทน</SelectItem>
                            <SelectItem value="5">หนังสือหายซื้อเล่มเดิมทดแทน</SelectItem>
                            <SelectItem value="6">อยู่รว่างรอขึ้นชั้น</SelectItem>
                            
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`StatusDate${formcolum.Repair_ID}`} className="text-lg font-bold">วันที่</Label>
                      <Input
                        type="datetime-local"
                        id={`StatusDate${index}`}
                        defaultValue={currentDatetime}
                        className={errors[`StatusDate${index}`] ? "border-red-500" : ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </form>
      </>
    );
  }
};

export default Create_Form_Service;
