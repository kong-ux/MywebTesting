"use client";
import { Card } from "@/components/ui/card";
import { BarChartMixed } from "@/components/Dashboard-component/Bar-Chart-Mixed/Bar-Chart";
import { CardReporting } from "@/components/Dashboard-component/Card-component/Card-ReportDorc-component";
import { CarouselComponent } from "@/components/Dashboard-component/carousel-component";

const Page = () => {
  return (
    <div className="w-full space-y-12">
      <div className="">
        <CardReporting />
      </div>
      <div className="flex items-center justify-center w-full space-x-24">
        <CarouselComponent />
      </div>
      <div className="justify-center w-full">
        <div className="max-w-4xl mx-auto">
          <BarChartMixed />
        </div>
      </div>
    </div>
  );
};

export default Page;
