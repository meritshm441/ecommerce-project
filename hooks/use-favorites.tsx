"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface FavoriteItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  brand: string
  category: string
  image: string
  rating: number
  reviews: number
  inStock: number
  discount?: number
}

interface FavoritesState {
  items: FavoriteItem[]
}

type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: FavoriteItem }
  | { type: "REMOVE_FAVORITE"; payload: { id: string } }
  | { type: "CLEAR_FAVORITES" }

const FavoritesContext = createContext<{
  items: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
} | null>(null)

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case "ADD_FAVORITE": {
      // Check if item already exists
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return state // Don't add duplicates
      }

      return {
        items: [...state.items, action.payload],
      }
    }

    case "REMOVE_FAVORITE": {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    }

    case "CLEAR_FAVORITES":
      return { items: [] }

    default:
      return state
  }
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] })

  const addFavorite = (item: FavoriteItem) => {
    dispatch({ type: "ADD_FAVORITE", payload: item })
  }

  const removeFavorite = (id: string) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: { id } })
  }

  const isFavorite = (id: string) => {
    return state.items.some((item) => item.id === id)
  }

  const clearFavorites = () => {
    dispatch({ type: "CLEAR_FAVORITES" })
  }

  return (
    <FavoritesContext.Provider
      value={{
        items: state.items,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
