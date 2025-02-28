import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine } from "lucide-react";
import { useAlert } from "@/hooks/use-alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Card } from "@/components/ui/card";
import fetchServiceByName from "./data";

interface BookData {
  BARCODE: string;
  BIBID: string;
  TITLE: string;
  COLLECTIONNAME: string;
  ITEMCLASSNAME: string;
}

interface ItemData {
  data: {
    message: {
      iteminfo: BookData[];
    };
  };
}

const Create_Form_Service = ({ data }: { data: ItemData[] | null }) => {
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [editableField, setEditableField] = useState<string | null>(null);
  const [formData, setFormData] = useState<ItemData[]>(data || []);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [selectedService, setSelectedService] = useState<{ [key: number]: string }>({});
  const [selectedserviceByName, setSselectedserviceByName] = useState<{ [key: number]: string }>({});
  const [isOtherSelected, setIsOtherSelected] = useState<{ [key: number]: boolean }>({});
  const [serviceByNameOptions, setServiceByNameOptions] = useState<string[]>([]);
  const currentDatetime = new Date()
    .toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok",
      hour12: false,
    })
    .replace(" ", "T")
    .slice(0, 16);
  const { showAlert } = useAlert(); // Destructure showAlert from the context

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const { ServiceByName } = await fetchServiceByName();
      setServiceByNameOptions(ServiceByName);
    };
    fetchData();
  }, []);

  const handleEditClick = (index: number, field: string) => {
    setEditableIndex(index);
    setEditableField(field);
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

  const handleServiceChange = (index: number, value: string) => {
    setSelectedService((prev) => ({ ...prev, [index]: value }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`service${index}`];
      return newErrors;
    });
  };

  const handleServiceByNameChange = (index: number, value: string) => {
    setSselectedserviceByName((prev) => ({ ...prev, [index]: value }));
    setIsOtherSelected((prev) => ({ ...prev, [index]: value === "อื่นๆ" }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`servicebyname${index}`];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    console.log("submit");
    const formElements = e.target as HTMLFormElement;
    const newErrors: { [key: string]: boolean } = {};
    let hasErrors = false;
    const alertContext: string[] = [];

    formData.forEach((_, index) => {
      [
        "bookid",
        "booknaome",
        "booktype",
        "bookaddress",
        "dateservice",
      ].forEach((field) => {
        const fieldId = `${field}${index}`;
        const element = formElements[fieldId];
        if (!element || !element.value) {
          newErrors[fieldId] = true;
          hasErrors = true;
          alertContext.push(`ช่อง ${field} อันที่ ${index + 1} เป็นค่าว่าง`);
        }
      });

      if (!selectedService[index]) {
        newErrors[`service${index}`] = true;
        hasErrors = true;
        alertContext.push(`ช่อง service อันที่ ${index + 1} เป็นค่าว่าง`);
      }
      if (!selectedserviceByName[index] ||selectedserviceByName[index] === "อื่นๆ" && !formElements[`servicebyname${index}`].value) {
        newErrors[`servicebyname${index}`] = true;
        hasErrors = true;
        alertContext.push(`ช่อง servicebyname อันที่ ${index + 1} เป็นค่าว่าง`);
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      showAlert("ไม่สามารถสร้างได้", alertContext.join("\n"), "Close");
      setIsLoading(false); // Set loading state to false
      return;
    }

    const submittedData = formData.map((item, index) => {
      const bookInfo = item.data.message.iteminfo[0];
      return {
        bookqr: bookInfo.BARCODE,
        bookid: formElements[`bookid${index}`].value,
        bookname: formElements[`booknaome${index}`].value,
        booktype: formElements[`booktype${index}`].value,
        bookaddress: formElements[`bookaddress${index}`].value, 
        service: selectedService[index],
        servicebyname: selectedserviceByName[index] === "อื่นๆ" ? formElements[`servicebyname${index}`].value : selectedserviceByName[index],
        dateservice: formElements[`dateservice${index}`].value,
      };
    });
    console.log("Submitted form data:", submittedData);

    // API UPLOAD
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
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
    if (response.status === 201) {
      console.log("responseData", responseData);
      showAlert("ไม่สามารถ", responseData.message, "OK");
      return;
    } else {
      showAlert("ทำการแจ้ง", responseData.message, "OK", () => {
        window.location.reload();
      });
    }

    setIsLoading(false); // Set loading state to false
  };

  if (!formData.length) {
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
              {isLoading ? "กำลังโหลด..." : "เพิ่มรายการ"}
            </Button>
          </div>
          {formData.map((item, index) => {
            const formcolum = item.data.message.iteminfo[0];
            const isEditable = editableIndex === index;
            return (
              <Card key={index} className="my-8">
                <div className="m-4 flex flex-col space-y-4">
                  <div>
                    <Label htmlFor={`bookid${index}`} className="font-bold">
                      รหัสหนังสือ
                    </Label>
                    <div className="relative items-center">
                      <Input
                        type="text"
                        id={`bookid${index}`}
                        placeholder="รหัสหนังสือ"
                        defaultValue={formcolum?.BIBID}
                        readOnly={
                          !(isEditable && editableField === `bookid${index}`)
                        }
                        className={
                          errors[`bookid${index}`] ? "border-red-500" : ""
                        }
                        onChange={handleInputChange}
                      />
                      <PenLine
                        className={`absolute right-2 top-2 cursor-pointer ${
                          isEditable && editableField === `bookid${index}`
                            ? "text-green-600"
                            : "text-red-600 dark:text-white"
                        }`}
                        onClick={() => handleEditClick(index, `bookid${index}`)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`booknaome${index}`} className="font-bold dark:text-red-500">
                      ชื่อหนังสือ
                    </Label>
                    <div className="relative items-center">
                      <Input
                        type="text"
                        id={`booknaome${index}`}
                        placeholder="ชื่อหนังสือ"
                        defaultValue={formcolum?.TITLE}
                        readOnly={
                          !(isEditable && editableField === `booknaome${index}`)
                        }
                        className={
                          errors[`booknaome${index}`] ? "border-red-500" : ""
                        }
                        onChange={handleInputChange}
                      />
                      <PenLine
                        className={`absolute right-2 top-2 cursor-pointer ${
                          isEditable && editableField === `booknaome${index}`
                            ? "text-green-600"
                            : "text-red-600 dark:text-white"
                        }`}
                        onClick={() =>
                          handleEditClick(index, `booknaome${index}`)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`booktype${index}`} className="font-bold">
                      ประเภททรัพยากร
                    </Label>
                    <div className="relative items-center">
                      <Input
                        type="text"
                        id={`booktype${index}`}
                        placeholder="ชนิดหนังชื่อ"
                        defaultValue={formcolum?.ITEMCLASSNAME}
                        readOnly={
                          !(isEditable && editableField === `booktype${index}`)
                        }
                        className={
                          errors[`booktype${index}`] ? "border-red-500" : ""
                        }
                        onChange={handleInputChange}
                      />
                      <PenLine
                        className={`absolute right-2 top-2 cursor-pointer ${
                          isEditable && editableField === `booktype${index}`
                            ? "text-green-600"
                            : "text-red-600 dark:text-white"
                        }`}
                        onClick={() =>
                          handleEditClick(index, `booktype${index}`)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor={`bookaddress${index}`}
                      className="font-bold"
                    >
                      สถานที่จัดเก็บ
                    </Label>
                    <div className="relative items-center">
                      <Input
                        type="text"
                        id={`bookaddress${index}`}
                        placeholder="ที่อยู่หนังสื่อ"
                        defaultValue={formcolum?.COLLECTIONNAME}
                        readOnly={
                          !(
                            isEditable &&
                            editableField === `bookaddress${index}`
                          )
                        }
                        className={
                          errors[`bookaddress${index}`] ? "border-red-500" : ""
                        }
                        onChange={handleInputChange}
                      />
                      <PenLine
                        className={`absolute right-2 top-2 cursor-pointer ${
                          isEditable && editableField === `bookaddress${index}`
                            ? "text-green-600"
                            : "text-red-600 dark:text-white"
                        }`}
                        onClick={() =>
                          handleEditClick(index, `bookaddress${index}`)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-lg font-bold">รายละเอียดการแจ้ง</Label>
                    <div className="flex">
                      <Select 
                        onValueChange={(value) => handleServiceChange(index, value)}
                      >
                        <SelectTrigger className={errors[`service${index}`] ? "border-red-500 bg-sky-400/20" : "bg-sky-400/20"}>
                          <SelectValue placeholder="เลือกเรื่องที่อัพเดท" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="หนังสือชำรุด">หนังสือชำรุด</SelectItem>
                          <SelectItem value="ไม่พบข้อมูลหนังสือ">ไม่พบข้อมูลหนังสือ</SelectItem>
                          <SelectItem value="หนังสือหาย">หนังสือหาย</SelectItem>
                          <SelectItem value="แก้ไขระเบียนบรรณานุกรมหนังสือ">แก้ไขระเบียนบรรณานุกรมหนังสือ</SelectItem>
                          <SelectItem value="บาร์โค้ดผิด/ชำรุด">บาร์โค้ดผิด/ชำรุด</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-lg font-bold">ชื่อผู้แจ้ง</Label>
                    <div className="flex">
                      <Select onValueChange={(value) => handleServiceByNameChange(index, value)}>
                        <SelectTrigger className={errors[`servicebyname${index}`] ? "border-red-500 bg-sky-400/20" : "bg-sky-400/20"}>
                          <SelectValue placeholder="เลือกชื่อผู้แจ้ง" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceByNameOptions.map((option, idx) => (
                            <SelectItem key={idx} value={option}>{option}</SelectItem>
                          ))}
                          <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {isOtherSelected[index] && (
                      <div className="flex items-center mt-2">
                        <Input
                          type="text"
                          id={`servicebyname${index}`}
                          placeholder="ชื่อผู้แจ้ง"
                          className={errors[`servicebyname${index}`] ? "border-red-500 bg-sky-400/20" : "bg-sky-400/20"}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor={`dateservice${index}`}
                      className="font-bold"
                    >
                      วันที่ทำรายการ
                    </Label>
                    <div className="flex items-center">
                      <Input
                        type="datetime-local" // Changed from "date" to "datetime-local"
                        id={`dateservice${index}`}
                        defaultValue={currentDatetime}
                        className={
                          errors[`dateservice${index}`] ? "border-red-500 bg-sky-400/20" : "bg-sky-400/20"
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </form>
      </>
    );
  }
};

export default Create_Form_Service;
