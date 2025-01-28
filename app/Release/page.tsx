"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useConfirmDialog } from "@/hooks/use-alert";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const formatDate = (dateString) => {
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("th-TH", options);
};

const checkboxsubmit = (data, checkedItems, setIsuploading, showAlert) => {
  const checkedData = data
    .filter((item) => checkedItems[item.Repair_ID])
    .map((item) => ({
      Repair_ID: item.Repair_ID,
      BookQR: item.BookQR,
    }));
  console.log(checkedData);
  showAlert("Confirm", "Are you sure you want to upload the data?", "Yes", () => {
    uploadData(checkedData, setIsuploading);
  });
};

const uploadData = async (data, setIsuploading) => {
  setIsuploading(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/postRelease`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Result:", result);
    window.location.reload();
  } catch (error) {
    console.error("Upload Error:", error.message);
  } finally {
    setIsuploading(false);
  }
};

const Page = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isuploading, setIsuploading] = useState(false); 
  const { toast } = useToast();
  const { showAlert } = useConfirmDialog();

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the checkbox state
    }));
  };

  const submit = (id, data) => {
    const item = data.find((item) => item.Repair_ID === id);
    if (item) {
      console.log([{ Repair_ID: item.Repair_ID, BookQR: item.BookQR }]);
      showAlert("Confirm", "Are you sure you want to upload the data?", "Yes", () => {
        uploadData([{ Repair_ID: item.Repair_ID, BookQR: item.BookQR }], setIsuploading);
      });
    }
  };

  const handleSearch = (e, data) => {
    if (e.key === "Enter") {
      const item = data.find((item) => item.BookQR === searchQuery);
      if (item) {
        if (checkedItems[item.Repair_ID]) {
          toast({
            description: `เพิ่ม ${item.BookQR} ไปแล้ว`,
            className: "text-red-500",
          });
        } else if (!checkedItems[item.Repair_ID]) {
          handleCheckboxChange(item.Repair_ID);
          toast({
            description: `เพิ่ม ${item.BookQR} แล้ว`,
            className: "text-green-500",
          });
        }
        setSearchQuery("");
      } else {
        toast({
          description: `ไม่พบรหัสดังกล่าว`,
          className: "text-red-500",
        });
      }
    }
  };

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getRelease`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  if (isLoading) {
    return (
      <div className="m-4">
        <h1 className="text-lg font-medium mb-4">Loading...</h1>
        <div className="w-full h-2 bg-gray-300 rounded">
          <div className="h-2 bg-blue-500 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="m-4">Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="m-4">ไม่พบข้อมูล</div>;
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="m-4">
      <h1 className="text-lg font-medium mb-4">คืนหนังสือ</h1>
      <div className="flex space-x-4 items-center mb-4">
        <h2 className="font-medium">รายการที่เลือก</h2>
        <Input
          type="text"
          className="w-1/3"
          placeholder="ค้นหา..BookQR"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => handleSearch(e, data)}
        />
        {checkedCount > 0 && (
          <Button 
          onClick={() => checkboxsubmit(data, checkedItems, setIsuploading, showAlert)}
          disabled={isuploading}
          >{isLoading ? "Loading..." : "คืนหนังสือทั้งหมด"} {checkedCount}</Button>
        )}
      </div>
      <div className="bg-card rounded-lg space-y-4">
        {data.map((item) => (
          <div
            key={item.Repair_ID}
            className={`space-y-4 p-4 rounded-lg ${
              checkedItems[item.Repair_ID] ? "border border-green-500" : "border border-gray-200"
            }`}
          >
            <div className="flex justify-between">
              <h1 className="text-lg font-medium">รายการที่ {item.Repair_ID}</h1>
              <h1 className="font-medium">รหัส QRCODE: {item.BookQR}</h1>
            </div>
            <div className="space-y-2">
              <h2 className="font-medium">ข้อมูลหนังสือ</h2>
              <div className="flex space-x-4">
                <p className="text-sm">ID: {item.BookID}</p>
                <p className="text-sm">ชื่อ: {item.Bookname}</p>
                <p className="text-sm">ประเภท: {item.BookType}</p>
                <p className="text-sm">ที่อยู่: {item.Bookaddress}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-medium">บริการ</h2>
              <div className="flex flex-wrap space-x-4">
                <p className="text-sm">รายการซ่อม: {item.Service}</p>
                {item.ServiceNote && <p className="text-sm">รายละเอียด: {item.ServiceNote}</p>}
                <p className="text-sm">เวลา: {formatDate(item.ServiceDate)}</p>
                <p className="text-sm">สถานะ: {item.StatusName}</p>
                <p className="text-sm">อัปเดตเมื่อ: {formatDate(item.StatusDate)}</p>
              </div>
            </div>
            <div className="flex justify-end items-center space-x-4">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={checkedItems[item.Repair_ID] || false}
                onChange={() => handleCheckboxChange(item.Repair_ID)}
              />
              <Button onClick={() => submit(item.Repair_ID, data)}
              disabled={isuploading}
                >{isLoading ? "Loading..." : "คืนหนังสือ"}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default Page;
