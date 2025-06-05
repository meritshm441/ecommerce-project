"use client"

import type React from "react"

import { FavoritesProvider as Provider } from "@/hooks/use-favorites"

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}
