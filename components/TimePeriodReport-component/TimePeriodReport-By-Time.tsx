"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import { useAlert } from "@/hooks/use-alert";
import CalendarDatePicker from "@/components/global/calendar-date-picker";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay } from "date-fns";

const TimePeriodReportByCarlendar = () => {
    const [bookData, setBookData] = useState([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const { showAlert } = useAlert();

    async function getdata() {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);
      
          if (!res.ok) {
            console.error("Fetching data failed:", res.status, res.statusText);
            throw new Error(`Failed to fetch data: ${res.status}`);
          }
      
          const data = await res.json();
      
          if (!Array.isArray(data)) {
            console.error("Invalid data format:", data);
            return [];
          }
      
          return data;
        } catch (error) {
          console.error("Error fetching data:", error);
          return [];
        }
    }
    
    const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!dateRange || !dateRange.from || !dateRange.to) {
            showAlert("กรุณาเลือกช่วงวันที่", "กรุณากรอกวันที่");
            return;
        }

        console.log("Selected date range:", dateRange.from, dateRange.to); // Debugging line

        const data = await getdata();
        const filteredBooks = data.filter(book => {
            const statusDate = new Date(book.StatusDate);
            const from = startOfDay(dateRange.from);
            const to = endOfDay(dateRange.to);
            return statusDate >= from && statusDate <= to;
        });

        if (filteredBooks.length > 0) {
            setBookData(filteredBooks);
        } else {
            setBookData([]);
            showAlert("ไม่พบข้อมูลหนังสือที่ค้นหา", "ไม่พบข้อมูลหนังสือที่ค้นหา");
        }
    };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold">
        ตรวจสอบเวลาการดำเนินการทรัพยากร
      </h1>
      <div className="mt-4 space-y-4">
        <h2 className="text-xl font-bold">
          ตรวจสอบเวลาการดำเนินการทรัพยากร
        </h2>
        <p className="text-gray-600">
          กรุณาเลือกช่วงวันที่เพื่อตรวจสอบเวลาการดำเนิการทรัพยากร
          </p>
        <form onSubmit={handlesubmit} className="flex space-x-4">
            <CalendarDatePicker date={dateRange} onDateSelect={setDateRange} />
          <Button type="submit">ค้นหา</Button>
        </form>
        {bookData.length > 0 && (
          <div className="mt-4">
            <h1 className="text-xl font-extrabold">
              ตรวจสอบเวลาการดำเนิการทรัพยากร
            </h1>
            {bookData.map((book, index) => (
              <Card key={index} className="p-3 justify-center mt-4">
                <CardHeader className="text-xl font-extrabold">
                  รหัสรายการซ่อม {book.Repair_ID} บาร์โค้ด {book.BookQR} รหัสหนังสือ {book.FK_BookID}
                </CardHeader>
                <CardContent className="flex space-x-32">
                  <div className="space-y-4">
                    <div className="flex justify-between space-x-16">
                      <p>รายการ {book.Service}</p>
                      <div className="flex space-x-4">
                        <p>วันที่ทำรายการ</p>
                        <p className="font-extrabold">{new Date(book.ServiceDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex justify-between space-x-16">
                      <p>สถานะ {book.StatusName}</p>
                      <div className="flex space-x-4">
                        <p>วันที่อัปเดตสถานะ</p>
                        <p className="font-extrabold">{new Date(book.StatusDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between space-x-8">
                    <p>ระยะเวลาการนำเนิดการทรัพยากร</p>
                    <div className="flex space-x-4">
                      <p className="font-extrabold">
                        {Math.ceil((new Date(book.StatusDate).getTime() - new Date(book.ServiceDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                      <p>วัน</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePeriodReportByCarlendar;