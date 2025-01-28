"use client"

import * as React from "react"
import { House } from "lucide-react"

export function TeamSwitcher() {
  return (
    <div className="flex items-center">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <House className="size-7" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">ARIT</span>
      </div>
    </div>
  )
}
