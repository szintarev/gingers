'use client'

import React, { createContext, use, useState, useEffect, useCallback } from 'react'

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

const SavedItemsContext = createContext<SavedItemsContextValue | null>(null)

export function SavedItemsProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gingers_saved')
      if (stored) setSavedItems(JSON.parse(stored))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('gingers_saved', JSON.stringify(savedItems))
    } catch {}
  }, [savedItems])

  const addToSaved = useCallback((item: SavedItem) => {
    setSavedItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev
      return [...prev, item]
    })
  }, [])

  const removeFromSaved = useCallback((id: number) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const isSaved = useCallback((id: number) => {
    return savedItems.some((i) => i.id === id)
  }, [savedItems])

  return (
    <SavedItemsContext.Provider value={{ savedItems, addToSaved, removeFromSaved, isSaved }}>
      {children}
    </SavedItemsContext.Provider>
  )
}

export function useSavedItems(): SavedItemsContextValue {
  const ctx = use(SavedItemsContext)
  if (!ctx) throw new Error('useSavedItems must be used within SavedItemsProvider')
  return ctx
}
