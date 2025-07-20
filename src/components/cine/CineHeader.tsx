
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Trash, Sparkles, Film, Tv, Video, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

interface CineHeaderProps {
  searchTerm: string
  onSearchTermChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (filter: string) => void
  typeFilter: string
  onTypeFilterChange: (filter: string) => void
  genreFilter: string
  onGenreFilterChange: (filter: string) => void
  genres: string[]
  onAddClick: () => void
  onClear: () => void
  onReset: () => void
}

export function CineHeader({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  genreFilter,
  onGenreFilterChange,
  genres,
  onAddClick,
  onClear,
  onReset
}: CineHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2 md:gap-4">
            <Video className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">CineList</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onAddClick}>
              <Plus className="md:mr-2" />
              <span className="hidden md:inline">Add New</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onReset}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>Reset to default</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onClear} className="text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Clear all</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-4 pb-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, actor, director..."
              value={searchTerm}
              onChange={e => onSearchTermChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                onClick={() => onSearchTermChange("")}
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </Button>
            )}
          </div>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger>
                <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="movie"><div className="flex items-center gap-2"><Film className="h-4 w-4" /> Movies</div></SelectItem>
              <SelectItem value="tv"><div className="flex items-center gap-2"><Tv className="h-4 w-4" /> TV Series</div></SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="watched">Watched</SelectItem>
              <SelectItem value="unwatched">Unwatched</SelectItem>
            </SelectContent>
          </Select>
           <div className="md:col-span-4">
             <Select value={genreFilter} onValueChange={onGenreFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
           </div>
        </div>
      </div>
    </header>
  )
}
