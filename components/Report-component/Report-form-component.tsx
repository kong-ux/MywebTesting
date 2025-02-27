"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { CalendarDatePicker } from "@/components/global/calendar-date-picker";
import fetchTypeBooks_AddressBook from "./data"; // Corrected import statement
import searchdata from "./searchdata"; // Import searchdata function
import { MultiSelect } from "@/components/ui/multi-select"; // Import MultiSelect component
import { Calendar } from "@/components/ui/calendar"

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
  const [User, setUser] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedBookState, setSelectedBookState] = useState<string[]>([]);
  const [selectedBookType, setSelectedBookType] = useState<string[]>([]);
  const [selectedBookAddress, setSelectedBookAddress] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [selectedServiceByName, setSelectedServiceByName] = useState<string[]>([]);
  const [selectedStatusName, setSelectedStatusName] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [inputFromDate, setInputFromDate] = useState<string>("");
  const [inputToDate, setInputToDate] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { BookType, Bookaddress, Bookstate, ServiceByName, Service, StatusName, User } =
          await fetchTypeBooks_AddressBook();

        // ✅ เซ็ตค่าใหม่โดยไม่เพิ่มซ้ำ
        setBookType(BookType || []);
        setBookaddress(Bookaddress || []);
        setBookstate(Bookstate || []);
        setServiceByName(ServiceByName || []);
        setService(Service || []);
        setStatusName(StatusName || []);
        setUser(User || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }
    fetchData();
  }, []); // ✅ useEffect เรียกใช้แค่ครั้งเดียว

  const handleDateSelect = ({ from, to }: { from: Date | null; to: Date | null }) => {
    console.log("ค่าที่เลือก:", { from, to });
    setDateRange({ 
      from: from ?? new Date(new Date().getFullYear(), 0, 1), 
      to: to ?? new Date() 
    });
    setInputFromDate(from ? from.toLocaleDateString("sv-SE") : "");
    setInputToDate(to ? to.toLocaleDateString("sv-SE") : "");
  };

  const handleInputFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    setInputFromDate(newFromDate);
    const fromDate = new Date(newFromDate);
    handleDateSelect({ from: fromDate, to: dateRange.to });
  };

  const handleInputToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    setInputToDate(newToDate);
    const toDate = new Date(newToDate);
    handleDateSelect({ from: dateRange.from, to: toDate });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const fromDate = dateRange.from.toLocaleDateString("sv-SE"); 
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999); // Ensure the end of the day is included
    const toDateString = toDate.toLocaleDateString("sv-SE");
    console.log("ข้อมูลSearch :", {
      inputValue,
      selectedBookState,
      selectedBookType,
      selectedBookAddress,
      selectedService,
      selectedServiceByName,
      selectedStatusName,
      selectedUser,
      fromDate,
      toDateString,
    });
    
      const filteredData = await searchdata(
        inputValue || "", // Ensure inputValue is a string
        selectedBookState || [], 
        selectedBookType || [],
        selectedBookAddress || [],
        selectedService || [],
        selectedServiceByName || [],
        selectedStatusName || [],
        selectedUser  || [],
        fromDate,
        toDateString
      );
      
    console.log("Filtered Data:", filteredData);
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
          {/* ✅ User */}
          <MultiSelect
          options={User.map((user) => ({ label: user, value: user }))}
          placeholder="เจ้าหน้าที่"
          onChange={setSelectedUser}
        />
        </div>

        <div className="space-y-4 space-x-2 w-1/4">
          <div className="flex items-center space-x-2">

          {/* ✅ CalendarDatePicker */}
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className="w-full"
            variant="outline"
            />
            <Input
            type="date"
            value={inputFromDate}
            onChange={handleInputFromDateChange}
            placeholder="จากวันที่"
          />
          <div className="text-center px-2 w-full">ถึง</div>
          <Input
          
            type="date"
            value={inputToDate}
            onChange={handleInputToDateChange}
            placeholder="ถึงวันที่"
          />
            </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "กำลังค้นหา..." : "ค้นหา"}
          </Button>
        </div>
      </form>
    </div>
  );
}
