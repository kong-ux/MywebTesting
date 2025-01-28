"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAlert } from "@/hooks/use-alert";

interface ServiceFormProps {
  OutputData: (data: unknown) => void; // Callback function to send data back
}

export function ServiceForm({ OutputData }: ServiceFormProps) {
  const { showAlert } = useAlert(); // Custom hook for alerts
  const [inputs, setInputs] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;

    // Automatically add or remove input fields
    if (value && index === inputs.length - 1) {
      newInputs.push(""); // Add a new input field
    } else if (newInputs[newInputs.length - 2] === "" && newInputs.length > 1) {
      newInputs.pop(); // Remove the last input field
    }

    setInputs(newInputs);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
  
    const filteredInputs = inputs.filter((input) => input.trim() !== "");
    console.log("filteredInputs:", filteredInputs);

    // Check for duplicate inputs
    const uniqueInputs = new Set(filteredInputs);
    if (uniqueInputs.size !== filteredInputs.length) {
      showAlert("ไม่สามารถดำเนินการ", "พบข้อมูลซ้ำกัน", "OK");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/repair`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputDataArray: filteredInputs }),
      });
  
      const rowResult = await response.json();
      console.log("rowResult:", rowResult);
      
      if (rowResult.status === 404 && Array.isArray(rowResult.itemId)) {
        // Construct messages for invalid itemIds
        const messages = rowResult.message.map((msg: string, index: number) => `มี ${msg}`);
        showAlert("ไม่สามารถดำเนินการ", messages.join("\n"), "OK");
      } else if (response.status === 200) {
        showAlert("สร้างเรียบร้อย", "พบข้อมูล", "OK");
        OutputData(rowResult.data);
        
      } else {
        throw new Error("Unexpected API response");
      }
      
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      showAlert("Error", errorMessage, "OK");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
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
          {loading ? "กำลังสร้าง..." : "สร้าง"}
        </Button>
      </form>
    </div>
  );
}
