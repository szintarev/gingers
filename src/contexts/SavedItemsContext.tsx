'use client'

import React, { createContext, use, useState, useEffect, useCallback } from 'react'

/*==================================================================
    TYPES
==================================================================*/
interface SavedItem {
  id: number
  name: string
  price: number
  image: string
  weight?: string
  category?: string
}

interface SavedItemsContextValue {
  savedItems: SavedItem[]
  addToSaved: (item: SavedItem) => void
  removeFromSaved: (id: number) => void
  isSaved: (id: number) => boolean
}

/*==================================================================
    CONTEXT
==================================================================*/
const SavedItemsContext = createContext<SavedItemsContextValue | null>(null)

/*==================================================================
    PROVIDER
==================================================================*/
export function SavedItemsProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gingers_saved')
      if (stored) setSavedItems(JSON.parse(stored))
    } catch {}
  }, [])

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem('gingers_saved', JSON.stringify(savedItems)) } catch {}
  }, [savedItems])

  const addToSaved = useCallback((item: SavedItem) => {
    setSavedItems((prev) => prev.find((i) => i.id === item.id) ? prev : [...prev, item])
  }, [])

  const removeFromSaved = useCallback((id: number) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const isSaved = useCallback((id: number) => savedItems.some((i) => i.id === id), [savedItems])

  return (
    <SavedItemsContext.Provider value={{ savedItems, addToSaved, removeFromSaved, isSaved }}>
      {children}
    </SavedItemsContext.Provider>
  )
}

/*==================================================================
    HOOK
==================================================================*/
export function useSavedItems(): SavedItemsContextValue {
  const ctx = use(SavedItemsContext)
  if (!ctx) throw new Error('useSavedItems must be used within SavedItemsProvider')
  return ctx
}
