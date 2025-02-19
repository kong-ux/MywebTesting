"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Component } from "./pie-chart";

interface DataProps {
  data: {
    Repair_ID: number;
    FK_BookID: string;
    BookQR: string;
    Bookname: string;
    BookType: string;
    Bookaddress: string;
    Bookstate: string;
    ServiceByName: string;
    Service: string;
    ServiceNote: string | null;
    ServiceDate: string;
    StatusName: string;
    StatusDate: string;
  }[];
}

export function Summary({ data }: DataProps) {
  // นับจำนวน Service แต่ละประเภท
  const serviceCounts = data.reduce((acc, item) => {
    const service = item.Service;
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});

  // นับจำนวน FK_BookID แต่ละประเภท
  const StatusNameCounts = data.reduce((acc, item) => {
    const StatusName = item.StatusName;
    acc[StatusName] = (acc[StatusName] || 0) + 1;
    return acc;
  }, {});

  // นับจำนวน BookType แต่ละประเภท
  const BookTypeCounts = data.reduce((acc, item) => {
    const bookType = item.BookType;
    acc[bookType] = (acc[bookType] || 0) + 1;
    return acc;
  }, {});

  // นับจำนวน Bookaddress แต่ละประเภท
  const BookaddressCounts = data.reduce((acc, item) => {
    const bookaddress = item.Bookaddress;
    acc[bookaddress] = (acc[bookaddress] || 0) + 1;
    return acc;
  }, {});

  // นับจำนวน ServiceByName แต่ละประเภท
  const ServiceByNameCounts = data.reduce((acc, item) => {
    const ServiceByName = item.ServiceByName;
    acc[ServiceByName] = (acc[ServiceByName] || 0) + 1;
    return acc;
  }, {});

  // แปลงเป็นรูปแบบที่กราฟต้องการ
  const DataService = Object.entries(serviceCounts)
    .filter(([state]) => state !== "รับเรื่องแจ้งแล้ว")
    .map(([state, num]) => ({
      state,
      num,
    }));

  const StatusName = Object.entries(StatusNameCounts).map(([state, num]) => ({
    state,
    num,
  }));

  const DataBookType = Object.entries(BookTypeCounts).map(([state, num]) => ({
    state,
    num,
  }));

  const DataBookaddress = Object.entries(BookaddressCounts).map(
    ([state, num]) => ({
      state,
      num,
    })
  );

  const DataServiceByName = Object.entries(ServiceByNameCounts).map(
    ([state, num]) => ({
      state,
      num,
    })
  );

  return (
    <Card className="flex flex-col py-8">
      <CardContent className="space-y-8">
        <div className="flex justify-between">
          <div className="w-1/4">
            <h1 className="text-xl font-bold">ประเภททรัพยากร</h1>
            {DataBookType.map((item) => (
              <div
                className="flex justify-between space-x-8 px-2"
                key={item.state}
              >
                <p>{item.state}</p>
                <div className="flex space-x-2">
                  <p>{item.num}</p>
                  <p>รายการ</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <Component chartData={DataBookType} />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/4">
            <h1 className="text-xl font-bold">สถานที่จัดเก็บ</h1>
            {DataBookaddress.map((item) => (
              <div
                className="flex justify-between space-x-8 px-2"
                key={item.state}
              >
                <p>{item.state}</p>
                <div className="flex space-x-2">
                  <p>{item.num}</p>
                  <p>รายการ</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <Component chartData={DataBookaddress} />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/4">
            <h1 className="text-xl font-bold">รายการ</h1>
            {DataService.map((item) => (
              <div
                className="flex justify-between space-x-8 px-2"
                key={item.state}
              >
                <p>{item.state}</p>
                <div className="flex space-x-2">
                  <p>{item.num}</p>
                  <p>รายการ</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <Component chartData={DataService} />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/4">
            <h1 className="text-xl font-bold">ชื่อผู้แจ้ง</h1>
            {DataServiceByName.map((item) => (
              <div
                className="flex justify-between space-x-8 px-2"
                key={item.state}
              >
                <p>{item.state}</p>
                <div className="flex space-x-2">
                  <p>{item.num}</p>
                  <p>รายการ</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <Component chartData={DataServiceByName} />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="w-1/4">
            <h1 className="text-xl font-bold">ประเภททรัพยากร</h1>
            {StatusName.map((item) => (
              <div
                className="flex justify-between space-x-8 px-2"
                key={item.state}
              >
                <p>{item.state}</p>
                <div className="flex space-x-2">
                  <p>{item.num}</p>
                  <p>รายการ</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <Component chartData={StatusName} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
