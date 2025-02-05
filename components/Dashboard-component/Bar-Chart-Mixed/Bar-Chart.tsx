"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { CalendarDatePicker } from "./calendar-date-picker";
import dataCardBarChart from "./data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ฟังก์ชันสุ่มสีแบบ HSL
const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 80%, 55%)`;

export function BarChartMixed() {
  const [chartData, setChartData] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [selectedCategory, setSelectedCategory] = useState("Serive");

  useEffect(() => {
    async function fetchData() {
      try {
        const { DataService, DataFK_BookID, DataBookType, DataBookaddress } =
          await dataCardBarChart(dateRange.from, dateRange.to);
        let data;
        switch (selectedCategory) {
          case "Serive":
            data = DataService;
            break;
          case "BookID":
            data = DataFK_BookID;
            break;
          case "BookType":
            data = DataBookType;
            break;
          case "Bookaddress":
            data = DataBookaddress;
            break;
          default:
            data = DataService;
        }
        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [dateRange, selectedCategory]);

  // สร้างสีแบบไดนามิกสำหรับแต่ละ state
  const chartColors = useMemo(() => {
    const colors = {};
    chartData.forEach((item) => {
      if (!colors[item.state]) {
        colors[item.state] = getRandomColor();
      }
    });
    return colors;
  }, [chartData]);

  // กำหนดสีให้ข้อมูล
  const chartDataWithColors = chartData.map((item) => ({
    ...item,
    color: chartColors[item.state] || "hsl(var(--chart-default))",
  }));

  // Calculate total for percentage calculation
  const total = chartData.reduce((sum, item) => sum + item.num, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">ค่าสถิติ</CardTitle>
        <CardDescription className="flex w-full justify-end items-center space-x-8">
          <Select defaultValue="Serive" onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="เลือกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Serive">บริการ</SelectItem>
                <SelectItem value="BookID">หนังสือ</SelectItem>
                <SelectItem value="BookType">ชนิด</SelectItem>
                <SelectItem value="Bookaddress">สถานที่</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={setDateRange}
            variant="outline"
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer>
          {/* Pie Chart */}
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartDataWithColors}
              className="text-2xl text-bold"
              dataKey="num"
              nameKey="state"
              label
            >
              {chartDataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="state" />}
              className="flex flex-wrap space-x-16 justify-center text-sm"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="m-8 space-y-6  ">
        {chartDataWithColors.map((item, index) => (
          <div
            className="flex border-b place-content-between text-lg text-bold"
            key={index}
          >
            <p>{item.state}</p>
            <div className="flex space-x-2">
              <p>{item.num}</p>
              <p>รายการ</p>
              <p>{((item.num / total) * 100).toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
