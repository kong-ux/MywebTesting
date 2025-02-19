"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import fetchTypeBooks_AddressBook from "./data"; // Corrected import statement
import searchdata from "./searchdata"; // Import searchdata function
import { MultiSelect } from "@/components/ui/multi-select"; // Import MultiSelect component

interface ReportFormProps {
  onFilteredData: (data: any[]) => void;
}

export function ReportForm({ onFilteredData }: ReportFormProps) {
  // ✅ ตั้งค่าตัวแปร state ให้อยู่ก่อน useEffect
  const [BookType, setBookType] = useState<string[]>([]);
  const [Bookaddress, setBookaddress] = useState<string[]>([]);
  const [Bookstate, setBookstate] = useState<string[]>([]);
  const [ServiceByName, setServiceByName] = useState<string[]>([]);
  const [Service, setService] = useState<string[]>([]);
  const [StatusName, setStatusName] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedBookState, setSelectedBookState] = useState<string | null>([]);
  const [selectedBookType, setSelectedBookType] = useState<string | null>([]);
  const [selectedBookAddress, setSelectedBookAddress] = useState<string | null>([]);
  const [selectedService, setSelectedService] = useState<string | null>([]);
  const [selectedServiceByName, setSelectedServiceByName] = useState<string | null>([]);
  const [selectedStatusName, setSelectedStatusName] = useState<string | null>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { BookType, Bookaddress, Bookstate, ServiceByName, Service, StatusName } =
          await fetchTypeBooks_AddressBook();

        // ✅ เซ็ตค่าใหม่โดยไม่เพิ่มซ้ำ
        setBookType(BookType || []);
        setBookaddress(Bookaddress || []);
        setBookstate(Bookstate || []);
        setServiceByName(ServiceByName || []);
        setService(Service || []);
        setStatusName(StatusName || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }
    fetchData();
  }, []); // ✅ useEffect เรียกใช้แค่ครั้งเดียว
  const handleDateSelect = ({ from, to }: { from: Date | null; to: Date | null }) => {
    setDateRange({ 
      from: from ?? new Date(new Date().getFullYear(), 0, 1), 
      to: to ?? new Date() 
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const fromDate = dateRange.from.toISOString().split("T")[0];
    const toDate = dateRange.to.toISOString().split("T")[0];
    console.log("ข้อมูลSearch :", {
      inputValue,
      selectedBookState,
      selectedBookType,
      selectedBookAddress,
      selectedService,
      selectedServiceByName,
      selectedStatusName,
      fromDate,
      toDate,
    });
    
      const filteredData = await searchdata(
        inputValue || "", // Ensure inputValue is a string
        selectedBookState || "", 
        selectedBookType || "",
        selectedBookAddress || "",
        selectedService || "",
        selectedServiceByName || "",
        selectedStatusName || "",
        fromDate,
        toDate
      );
      
    // console.log("Filtered Data:", filteredData);
    onFilteredData(filteredData);
    setLoading(false);
  };

  return (
    <div className="w-full px-8 mx-auto space-y-2">
      <form className="w-full flex flex-col space-y-3" onSubmit={handleSubmit}>
        <div className="w-full grid grid-cols-3 gap-3">
          <Input
            type="text"
            placeholder="ชื่อหนังสือ / บาร์โค้ด  / รหัสหนังสือ "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          
          {/* ✅ Bookstate */}
          <MultiSelect
            options={Bookstate.map((type) => ({ label: type, value: type }))}
            placeholder="สถานะหนังสือ"
            onChange={setSelectedBookState}
          />

          {/* ✅ BookType */}
          <MultiSelect
            options={BookType.map((type) => ({ label: type, value: type }))}
            placeholder="ประเภททรัพยากร"
            onChange={setSelectedBookType}
          />

          {/* ✅ Bookaddress */}
          <MultiSelect
            options={Bookaddress.map((address) => ({ label: address, value: address }))}
            placeholder="สถานที่จัดเก็บ"
            onChange={setSelectedBookAddress}
          />

          {/* ✅ Service */}
          <MultiSelect
            options={Service.map((service) => ({ label: service, value: service }))}
            placeholder="รายการ"
            onChange={setSelectedService}
          />

          {/* ✅ ServiceByName */}
          <MultiSelect
            options={ServiceByName.map((name) => ({ label: name, value: name }))}
            placeholder="ชื่อผู้แจ้ง"
            onChange={setSelectedServiceByName}
          />

          {/* ✅ StatusName */}
          <MultiSelect
            options={StatusName.map((status) => ({ label: status, value: status }))}
            placeholder="สถานะทรัพยากร"
            onChange={setSelectedStatusName}
          />

          {/* ✅ CalendarDatePicker */}
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className="w-full"
            variant="outline"
          />
        </div>

        <div className="space-y-4 space-x-2 w-1/4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "กำลังค้นหา..." : "ค้นหา"}
          </Button>
        </div>
      </form>
    </div>
  );
}
