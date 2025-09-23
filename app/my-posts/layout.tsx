"use client"
import React, { useEffect, useState } from "react"
import SideNav from "@/components/sideNav/sideNav"

export default function PostUserLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent render before hydration to avoid sidebar flash
  if (!mounted) return null

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto transition-all duration-300">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
