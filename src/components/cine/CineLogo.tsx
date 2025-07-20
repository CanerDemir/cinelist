
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function CineLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <path d="M20.5 8.5 16 13l-3.41-3.41" />
      <path d="M4 4h16v16H4z" />
      <path d="m14.5 4.5 6 6" />
      <path d="m11.5 4.5 6 6" />
      <path d="m8.5 4.5 6 6" />
      <path d="m5.5 4.5 6 6" />
    </svg>
  )
}
