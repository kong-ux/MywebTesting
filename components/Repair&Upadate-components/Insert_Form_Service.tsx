import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAlert } from "@/hooks/use-alert";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: number]: string;
  }>({});
const currentDatetime = new Date().toLocaleString("sv-SE", {
  timeZone: "Asia/Bangkok",
}).replace(" ", "T").slice(0, 16);
  const { showAlert } = useAlert(); // Destructure showAlert from the context

  useEffect(() => {
    if (data) {
      setFormData(data);
      const initialStatuses: { [key: number]: string } = {}; // Add this line
      data.forEach((item, index) => {
        initialStatuses[index] = item.data.StatusName; // Add this line
      });
    }
  }, [data]);


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
      const status = selectedStatus[index];
      if (!status) {
        newErrors[`StatusName${index}`] = true;
        hasErrors = true;
        alertContext.push(`ช่อง สถานะ อันที่ ${index + 1} เป็นค่าว่าง`);
      }

      ["StatusDate"].forEach((field) => {
        const fieldId = `${field}${index}`;
        const formElement = formElements[fieldId] as HTMLInputElement;
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
      const status = selectedStatus[index];
      const StatusDate = new Date(formElements[`StatusDate${index}`].value);
      StatusDate.setHours(StatusDate.getHours() + 7); // Adjust for 7-hour difference

      return {
        Repair_ID: Repair_ID,
        status: status,
        StatusDate: StatusDate.toISOString(),
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
    );
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
                      <Label className="text-lg font-bold">สถานะหนังสือทรัพยากร</Label>
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
                      <p className="font-bold">&nbsp;{formcolum.Service}</p>
                    </div>
                  <div className="flex space-x-8">
                    <div>
                      <Label className="text-lg font-bold">สะถาณะทรัพยากร</Label>
                      <div className="flex">
                        <Select
                          onValueChange={(value) =>
                            handleStatusChange(index, value)
                          }
                          >
                          <SelectTrigger
                            className={
                              errors[`StatusName${index}`]
                              ? "border-red-500 bg-sky-400/20"
                              : "bg-sky-400/20"
                            }
                            >
                            <SelectValue placeholder="กรุณาอัพเดทสถานะ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">
                              อยู่ระหว่างการดำเนินการ
                            </SelectItem>
                            <SelectItem value="2">
                              อยู่ระหว่างการซ่อม
                            </SelectItem>
                            <SelectItem value="3">
                              สือหายซื้อเล่มใหม่ทดแทน
                            </SelectItem>
                            <SelectItem value="4">
                              หนังสือหายซื้อเล่มเดิมทดแทน
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor={`StatusDate${formcolum.Repair_ID}`}
                        className="text-lg font-bold"
                        >
                        วันที่
                      </Label>
                      <Input
                        type="datetime-local"
                        id={`StatusDate${index}`}
                        defaultValue={currentDatetime}
                        className={
                          errors[`StatusDate${index}`] ? "border-red-500 bg-sky-400/20" : "bg-sky-400/20"
                        }
                        onChange={handleInputChange}
                      />
                    </div>
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
