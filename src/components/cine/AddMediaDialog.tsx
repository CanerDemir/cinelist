"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { MediaItem } from "@/lib/types"
import { ALL_MEDIA } from "@/lib/data"
import { Check, Plus, Search } from "lucide-react"

interface AddMediaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: MediaItem) => void
  currentList: MediaItem[]
}

export function AddMediaDialog({
  open,
  onOpenChange,
  onAddItem,
  currentList,
}: AddMediaDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const searchResults = useMemo(() => {
    if (!searchTerm) return []
    return ALL_MEDIA.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const currentListIds = useMemo(() => new Set(currentList.map(item => item.id)), [currentList])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>Add to your list</DialogTitle>
          <DialogDescription>
            Search for a movie or TV series to add to your watchlist.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <ScrollArea className="h-[400px] mt-4">
          <div className="flex flex-col gap-4 pr-4">
            {searchResults.map(item => {
              const isAdded = currentListIds.has(item.id)
              return (
                <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Image
                    src={item.poster}
                    alt={item.title}
                    width={60}
                    height={90}
                    className="rounded-md object-cover"
                    data-ai-hint={item.data_ai_hint}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.year} &middot; {item.type === 'movie' ? 'Movie' : 'TV Series'}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddItem(item)}
                    disabled={isAdded}
                    variant={isAdded ? 'secondary' : 'default'}
                  >
                    {isAdded ? <Check className="mr-2" /> : <Plus className="mr-2" />}
                    {isAdded ? 'Added' : 'Add'}
                  </Button>
                </div>
              )
            })}
             {searchTerm && searchResults.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <p>No results for "{searchTerm}".</p>
              </div>
            )}
            {!searchTerm && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Start typing to find movies and TV shows.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
