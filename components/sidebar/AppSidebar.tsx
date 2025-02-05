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
      title: "Report",
      href: "/Report-form",
      icon: PenLine,
    },
    {
      title: "Repair&Update",
      href: "/Repair&Update",
      icon: BookMarked,
    },
    {
      title: "Release",
      href: "/Release",
      icon: ArrowUpNarrowWide,
    },
    {
      title: "TABLE DATA",
      href: "/TableData",
      icon: Table2,
    },
    {
      title: "DASHBOARD",
      href: "/Dashboard",
      icon: SquareKanban,
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
