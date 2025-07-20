"use client"

import * as React from "react"
import { useState, useMemo, useCallback } from "react"
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
import { Check, Plus, Search, Loader2, X } from "lucide-react"
import { searchMovies, SearchMoviesOutput } from "@/ai/flows/search-movies-flow"
import { useToast } from "@/hooks/use-toast"

interface AddMediaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: MediaItem) => void
  currentList: MediaItem[]
}

type SearchResultItem = SearchMoviesOutput[0];

export function AddMediaDialog({
  open,
  onOpenChange,
  onAddItem,
  currentList,
}: AddMediaDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([])
      return
    }
    setIsLoading(true)
    try {
      const results = await searchMovies({ query })
      setSearchResults(results)
    } catch (error) {
      console.error("Failed to search for movies:", error)
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Could not fetch movie results. Please try again.",
      })
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (query: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        handleSearch(query)
      }, 500)
    }
  }, [handleSearch])

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    debouncedSearch(""); 
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchTerm(query)
    if(query.length > 2) {
        debouncedSearch(query)
    } else {
        setSearchResults([]);
    }
  }

  const handleAddItem = (item: SearchResultItem) => {
     const newItem: MediaItem = {
      ...item,
      watched: false,
    };
    onAddItem(newItem);
  }

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
            onChange={handleInputChange}
            className="pl-10 pr-10"
          />
          {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />}
          {!isLoading && searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                onClick={handleClearSearch}
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </Button>
          )}
        </div>
        <ScrollArea className="h-[400px] mt-4">
          <div className="flex flex-col gap-4 pr-4">
            {searchResults.map(item => {
              const isAdded = currentListIds.has(item.id)
              return (
                <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Image
                    src={item.poster || "https://placehold.co/60x90.png"}
                    alt={item.title}
                    width={60}
                    height={90}
                    className="rounded-md object-cover bg-muted"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.year} &middot; {item.type === 'movie' ? 'Movie' : 'TV Series'}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddItem(item)}
                    disabled={isAdded}
                    variant={isAdded ? 'secondary' : 'default'}
                  >
                    {isAdded ? <Check className="mr-2" /> : <Plus className="mr-2" />}
                    {isAdded ? 'Added' : 'Add'}
                  </Button>
                </div>
              )
            })}
             {!isLoading && searchTerm && searchResults.length === 0 && (
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
