import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine } from "lucide-react";
import { useAlert } from "@/hooks/use-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { FormControl } from "../ui/form";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

import {
  Card,
} from "@/components/ui/card";

interface BookData {
  BARCODE:string;
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
  const currentDatetime = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Bangkok",
    hour12: false,
  }).replace(" ", "T").slice(0, 16);
  const { showAlert } = useAlert(); // Destructure showAlert from the context

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    console.log("submit")
    const formElements = e.target as HTMLFormElement;
    const newErrors: { [key: string]: boolean } = {};
    let hasErrors = false;
    const alertContext: string[] = [];

    formData.forEach((_, index) => {
      ["bookid", "booknaome", "booktype", "bookaddress", "servicebyname", "dateservice"].forEach((field) => {
        const fieldId = `${field}${index}`;
        if (!formElements[fieldId].value) {
          newErrors[fieldId] = true;
          hasErrors = true;
          alertContext.push(`ช่อง ${field} อันที่ ${index+1} เป็นค่าว่าง`);
        }
      });
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
        servicebyname: formElements[`servicebyname${index}`].value,
        dateservice: formElements[`dateservice${index}`].value,
      };
    });
    console.log("Submitted form data:", submittedData);

    // API UPLOAD
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submittedData),
      });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Error Response:", responseData);
      showAlert("ทำการผิดพลาด", responseData.message, "OK");
    }
    if(response.status === 201){
      console.log("responseData", responseData)
      showAlert("ไม่สามารถ", responseData.message, "OK");
      return
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
    )
  } else {
    return (
      <>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="w-full flex justify-end mb-4">
            <Button className="w-25 h-12 mr-8" type="submit" disabled={isLoading}>
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
                        readOnly={!(isEditable && editableField === `bookid${index}`)}
                        className={errors[`bookid${index}`] ? "border-red-500" : ""}
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
                    <Label htmlFor={`booknaome${index}`} className="font-bold">
                      ชื่อหนังสือ
                    </Label>
                    <div className="relative items-center">
                      <Input
                        type="text"
                        id={`booknaome${index}`}
                        placeholder="ชื่อหนังสือ"
                        defaultValue={formcolum?.TITLE}
                        readOnly={!(isEditable && editableField === `booknaome${index}`)}
                        className={errors[`booknaome${index}`] ? "border-red-500" : ""}
                        onChange={handleInputChange}
                      />
                      <PenLine
                        className={`absolute right-2 top-2 cursor-pointer ${
                          isEditable && editableField === `booknaome${index}`
                            ? "text-green-600"
                            : "text-red-600 dark:text-white"
                        }`}
                        onClick={() => handleEditClick(index, `booknaome${index}`)}
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
                        readOnly={!(isEditable && editableField === `booktype${index}`)}
                        className={errors[`booktype${index}`] ? "border-red-500" : ""}
                        onChange={handleInputChange}
                      />
                      <PenLine
                        className={`absolute right-2 top-2 cursor-pointer ${
                          isEditable && editableField === `booktype${index}`
                            ? "text-green-600"
                            : "text-red-600 dark:text-white"
                        }`}
                        onClick={() => handleEditClick(index, `booktype${index}`)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`bookaddress${index}`} className="font-bold">
                    สถานที่จัดเก็บ
                    </Label>
                    <div className="relative items-center">
                      <Input
                        type="text"
                        id={`bookaddress${index}`}
                        placeholder="ที่อยู่หนังสื่อ"
                        defaultValue={formcolum?.COLLECTIONNAME}
                        readOnly={!(isEditable && editableField === `bookaddress${index}`)}
                        className={errors[`bookaddress${index}`] ? "border-red-500" : ""}
                        onChange={handleInputChange}
                      />
                      <PenLine
                        className={`absolute right-2 top-2 cursor-pointer ${
                          isEditable && editableField === `bookaddress${index}`
                            ? "text-green-600"
                            : "text-red-600 dark:text-white"
                        }`}
                        onClick={() => handleEditClick(index, `bookaddress${index}`)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`servicebyname${index}`}>ชื่อผู้แจ้ง</Label>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        id={`servicebyname${index}`}
                        placeholder="ชื่อผู้แจ้ง"
                        className={errors[`servicebyname${index}`] ? "border-red-500" : ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`dateservice${index}`} className="font-bold">
                      วันที่
                    </Label>
                    <div className="flex items-center">
                      <Input
                        type="datetime-local" // Changed from "date" to "datetime-local"
                        id={`dateservice${index}`}
                        defaultValue={currentDatetime}
                        className={errors[`dateservice${index}`] ? "border-red-500" : ""}
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
