"use client";

import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
import { CalendarDatePicker } from "./calendar-date-picker";
import { useState, useEffect } from "react";
import dataCardDashboard from "./data";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartColors = {
  อยู่ละหว่างรับเรื่อง: "hsl(var(--chart-1))",
  อยู่หว่างดำเนินการ: "hsl(var(--chart-2))",
  เตรียมจำหน่ายออก: "hsl(var(--chart-3))",
  ส่งคืนไปแล้ว: "hsl(var(--chart-4))",
};

const chartConfig: ChartConfig = {
  num: { label: "จำนวน" },
  ...Object.fromEntries(
    Object.entries(chartColors).map(([key, color]) => [
      key,
      { label: key, color },
    ])
  ),
};

export function CardReporting() {
  const [chartData, setChartData] = useState([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { DataCardReporting } = await dataCardDashboard(
          dateRange.from,
          dateRange.to
        );
        setChartData(DataCardReporting);
      } catch (error) {
        console.error("Error fetching data for CardReporting:", error);
      }
    }
    fetchData();
  }, [dateRange]);

  // เพิ่มสีให้กับ chartData โดยใช้ chartColors
  const chartDataWithColors = chartData.map((item) => ({
    ...item,
    color: chartColors[item.state] || "hsl(var(--chart-default))", // สี default ถ้าไม่ตรง
  }));

  const totalReports = React.useMemo(() => {
    return chartDataWithColors.reduce((acc, curr) => acc + curr.num, 0);
  }, [chartDataWithColors]);

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // table.getColumn(dateColumn)?.setFilterValue([from, to]);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="">
        <CardTitle className="text-bold text-2xl">จำรายการทั้งหมด</CardTitle>
        <CardDescription className="flex W-full justify-end items-center space-x-8">
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className=""
            variant="outline"
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartDataWithColors}
              dataKey="num"
              nameKey="state"
              innerRadius={60}
              strokeWidth={10}
            >
              {chartDataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalReports.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          รายการ
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="state" />}
              className=" flex space-x-18 [&>*]:basis-1/4 [&>*]:justify-center text-sm"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-center text-bold space-x-8">
        {chartDataWithColors.map((item, index) => (
          <div key={index}>
            {item.state} {item.num} รายการ
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
