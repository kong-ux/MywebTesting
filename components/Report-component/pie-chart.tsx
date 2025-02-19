"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  state: string;
  num: number;
}

const chartConfig: ChartConfig = {
  visitors: {
    label: "Visitors",
  },
};

const generateColors = (count: number) => {
  return Array.from({ length: count }, (_, i) => `hsl(var(--chart-${i + 1}))`);
};

export function Component({ chartData }: { chartData: ChartData[] }) {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.num, 0);
  }, [chartData]);

  const colors = generateColors(chartData.length);

  const dataWithColors = chartData.map((data, index) => ({
    ...data,
    fill: colors[index % colors.length],
  }));

  return (
    <Card className="flex min-h-[180px]">
      <CardContent className="flex">
        <ChartContainer config={chartConfig} className="max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={dataWithColors}
              dataKey="num"
              nameKey="state"
              innerRadius={40}
              strokeWidth={3}
            >
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
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          ทั้งหมด
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="flex flex-col justify-center space-y-2 p-4">
        {chartData.map((data, index) => (
          <div className="flex justify-between space-x-10 " key={index}>
            <p>{data.state} </p><p>{((data.num / totalVisitors) * 100).toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
