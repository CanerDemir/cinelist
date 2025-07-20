"use client"

import * as React from "react"
import { useMemo, useState, useEffect } from "react"
import type { MediaItem } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ALL_MEDIA, INITIAL_MEDIA } from "@/lib/data"
import { CineHeader } from "@/components/cine/CineHeader"
import { ContentCard } from "@/components/cine/ContentCard"
import { ContentDetailsDialog } from "@/components/cine/ContentDetailsDialog"
import { AddMediaDialog } from "@/components/cine/AddMediaDialog"
import { SkeletonGrid } from "@/components/cine/SkeletonGrid"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const [mediaItems, setMediaItems] = useLocalStorage<MediaItem[]>("mediaItems", INITIAL_MEDIA)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // 'all', 'watched', 'unwatched'
  const [typeFilter, setTypeFilter] = useState("all") // 'all', 'movie', 'tv'
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const genres = useMemo(() => {
    const allGenres = mediaItems.flatMap(item => item.genre)
    return ["All Genres", ...Array.from(new Set(allGenres)).sort()]
  }, [mediaItems])

  const [genreFilter, setGenreFilter] = useState("All Genres")

  const filteredItems = useMemo(() => {
    return mediaItems.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.director && item.director.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.actors && item.actors.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase())))
      
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "watched" && item.watched) ||
        (statusFilter === "unwatched" && !item.watched)
      
      const matchesType =
        typeFilter === 'all' || item.type === typeFilter

      const matchesGenre =
        genreFilter === "All Genres" || item.genre.includes(genreFilter)
        
      return matchesSearch && matchesStatus && matchesType && matchesGenre
    })
  }, [mediaItems, searchTerm, statusFilter, typeFilter, genreFilter])

  const handleToggleWatched = (id: string) => {
    setMediaItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, watched: !item.watched } : item
      )
    )
  }
  
  const handleDeleteItem = (id: string) => {
    setMediaItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
        title: "Removed from list",
        description: `The item has been removed from your watchlist.`,
    })
    setItemToDelete(null);
  }

  const handleAddItem = (item: MediaItem) => {
    if (!mediaItems.find(mi => mi.id === item.id)) {
      setMediaItems(prevItems => [...prevItems, { ...item, watched: false }])
      toast({
        title: "Added to list",
        description: `"${item.title}" has been added to your watchlist.`,
      })
    } else {
       toast({
        variant: "destructive",
        title: "Already in list",
        description: `"${item.title}" is already in your watchlist.`,
      })
    }
  }

  const handleClearList = () => {
    setMediaItems([]);
  }

  const handleResetList = () => {
    setMediaItems(INITIAL_MEDIA);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <CineHeader
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        genreFilter={genreFilter}
        onGenreFilterChange={setGenreFilter}
        genres={genres}
        onAddClick={() => setIsAddDialogOpen(true)}
        onClear={handleClearList}
        onReset={handleResetList}
      />
      <main className="flex-1 p-4 md:p-6">
        {!isMounted ? (
          <SkeletonGrid />
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredItems.map(item => (
              <ContentCard
                key={item.id}
                item={item}
                onToggleWatched={handleToggleWatched}
                onSelect={() => setSelectedItem(item)}
                onDelete={() => setItemToDelete(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
            <h2 className="text-2xl font-semibold">No Results Found</h2>
            <p className="mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
      <ContentDetailsDialog
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
      <AddMediaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddItem={handleAddItem}
        currentList={mediaItems}
      />
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{itemToDelete?.title}" from your watchlist. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => itemToDelete && handleDeleteItem(itemToDelete.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
