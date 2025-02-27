import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import SheetData from "../Repair&Upadate-components/data";
import { useEffect, useState } from "react";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('th-TH', options);
};

const SheetTriggerButton = () => {
  const [data, setData] = useState({ Reported: [], Working: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await SheetData();
      setData(result);
    };
    fetchData();
  }, []);

  const { Reported, Working } = data;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">ดูรายการ</Button>
      </SheetTrigger>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle className="text-2xl">รายการทั้งหมด</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="border-b">
          <h1 className="textbold text-xl">อยู่ระหว่าดำเนินการ</h1>
          <div className="max-h-96 overflow-y-auto ">
            {Working.length > 0 ? (
              Working.map((item, index) => (
                <Card className="border p-2 space-y-2" key={index}>
                  <div className="flex justify-between">
                    <p>รหัส Barcode {item.BookQR}</p>
                    <p>รหัส หนังสือ {item.BookID}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>บริการ {item.Service}</p>
                    <p>วันที่ {formatDate(item.ServiceDate)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>สถานะ {item.Status}</p>
                    <p>วันที่ {formatDate(item.StatusDate)}</p>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border p-2">
                <p className="text-bold">ไม่มีรายการ</p>
              </Card>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetTriggerButton;
