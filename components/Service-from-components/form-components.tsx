"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CheckForm from "./check-form";
import { useAlert } from "@/hooks/use-alert";

interface ServiceFormProps {
  OutputData: (data: FunctionStringCallback) => void; // Callback function เพื่อส่ง data กลับไป
}

export function ServiceForm({ OutputData }: ServiceFormProps) {
  const { showAlert } = useAlert(); // ใช้ hook ที่นี่
  const [inputs, setInputs] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;

    if (value && index === inputs.length - 1) {
      newInputs.push(""); // เพิ่มช่องกรอกใหม่
    }

    if (newInputs[newInputs.length - 2] === "" && newInputs.length > 1) {
      newInputs.pop(); // ลบช่องกรอกสุดท้าย
    }

    setInputs(newInputs);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const filteredInputs = inputs.filter((input) => input.trim() !== "");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get_books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Input_data_Array: filteredInputs }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const rowResult = await response.json();
      console.log("rowResult", rowResult);
      const checkedData = CheckForm({ data: rowResult, showAlert }); 

      console.log("checkedData", checkedData);

      if (checkedData !== null) {
        OutputData(checkedData); // ส่งข้อมูลไปยัง OutputData
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <form onSubmit={submit} className="felx flex-col space-y-3">
        {inputs.map((input, index) => (
          <div key={index}>
            <Input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="รหัส Barcode"
            />
          </div>
        ))}
        <Button type="submit" disabled={loading}>
          {loading ? 'กำลังสร้าง...' : 'สร้าง'}
        </Button>
      </form>
    </div>
  );
}
