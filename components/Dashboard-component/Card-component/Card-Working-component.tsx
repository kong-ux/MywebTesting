"use client";
import React from "react";
import { CalendarDatePicker } from "./calendar-date-picker";
import { useState, useEffect } from "react";
import dataCardDashboard from "./data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartColors = {
  อยู่หว่างดำเนินการ: "hsl(var(--chart-2))",
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

export function CardWorking() {
  const [chartData, setChartData] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { DataCardReporting } = await dataCardDashboard(dateRange.from, dateRange.to);
        const processingData = DataCardReporting.find(item => item.state === "อยู่หว่างดำเนินการ");
        setChartData(processingData ? [processingData] : []);
        const total = DataCardReporting.reduce((acc, curr) => acc + curr.num, 0);
        setTotalReports(total);
      } catch (error) {
        console.error("Error fetching data for CardWorking:", error);
      }
    }
    fetchData();
  }, [dateRange]);

  const chartDataWithColors = chartData.map((item) => ({
    ...item,
    fill: chartColors[item.state] || "hsl(var(--chart-2))", // สี default ถ้าไม่ตรง
  }));

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // table.getColumn(dateColumn)?.setFilterValue([from, to]);
  };

  const percentageCompleted = totalReports > 0 ? 100-(((chartData[0]?.num || 0) / totalReports) * 100) : 0;
  const endAngle = (percentageCompleted / 100) * 360;

  return (
    <Card className="flex flex-col">
      <CardHeader className="">
        <CardTitle className="text-bold text-2xl">อยู่ระหว่างดำเนินการ</CardTitle>
        <CardDescription className="">
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
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartDataWithColors}
            startAngle={0}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="num" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0]?.num?.toLocaleString() || 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill"
                        >
                          รายการ
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          อยู่ระหว่างดำเนินการ {chartData[0]?.num?.toLocaleString() || 0} รายการ จากทั้งหมด {totalReports.toLocaleString()} รายการ
        </div>
        <div className="leading-none text-muted-foreground">
          ดำเนินการไปทังหมด {percentageCompleted.toFixed(2)} % จากทั้งหมด 100%
        </div>
      </CardFooter>
    </Card>
  );
}
