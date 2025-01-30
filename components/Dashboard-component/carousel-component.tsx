"use client";
import * as React from "react";
import { Reported } from "@/components/Dashboard-component/Card-component/Card-Reported-component";
import { CardWorking } from "@/components/Dashboard-component/Card-component/Card-Working-component";
import { CardReleased } from "@/components/Dashboard-component/Card-component/Card-Released-component";
import { CardRadyReleased } from "@/components/Dashboard-component/Card-component/Card-RadyReleased-ccomponent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselComponent() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem className="basis-1/3"><Reported /></CarouselItem>
        <CarouselItem className="basis-1/3"><CardWorking /></CarouselItem>
        <CarouselItem className="basis-1/3"><CardReleased /></CarouselItem>
        <CarouselItem className="basis-1/3"><CardRadyReleased /></CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
