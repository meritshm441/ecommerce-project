"use client"

import type React from "react"

import { CartProvider as Provider } from "@/hooks/use-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}
