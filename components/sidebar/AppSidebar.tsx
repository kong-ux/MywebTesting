"use client"

import * as React from "react"
import {
  House,
  PenLine,
  BookMarked,
  SquareLibrary,
  ArrowUpNarrowWide,
  Table2,
  SquareKanban,
  Clock2,
} from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


const Menu = {
  navMain: [
    {
      title: "Home",
      href: "/",
      icon: House,
    },
    {
      title: "เพิ่มรายการแจ้งข้อมูลทรัพยากร",
      href: "/Report-form",
      icon: PenLine,
    },
    {
      title: "สถานะการนำเนิดการ",
      href: "/Repair&Update",
      icon: BookMarked,
    },
    {
      title: "นำหนังสือขึ้นชั้น",
      href: "/Release",
      icon: ArrowUpNarrowWide,
    },
    {
      title: "ตารางจัดการข้มูล",
      href: "/TableData",
      icon: Table2,
    },
    {
      title: "รายงายการทรัพยากร",
      href: "/Report",
      icon: SquareKanban,
    },
    {
      title: "ระยะเวลาการนำเนินการทรัพยากร",
      href: "/TimePeriodReport",
      icon: Clock2,
    },

  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  return (
    <Sidebar className="" collapsible="icon" {...props}>
      <SidebarHeader className="bg-primary">
        <div onClick={useSidebar().toggleSidebar} className="flex items-center">
          <div  className="flex aspect-square size-8 items-center justify-center rounded-lg ">
            <SquareLibrary className="size-7 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-white text-2xl ">ู&nbsp;ARIT SERVICE</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain navMain={Menu.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
