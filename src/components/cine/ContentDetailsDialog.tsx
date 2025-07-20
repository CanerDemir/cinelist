"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { MediaItem } from "@/lib/types"
import { Star, Clapperboard, Tv, Calendar, User, Users } from "lucide-react"

interface ContentDetailsDialogProps {
  item: MediaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContentDetailsDialog({ item, open, onOpenChange }: ContentDetailsDialogProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-6 flex justify-center">
              <Image
                src={item.poster}
                alt={item.title}
                width={300}
                height={450}
                className="rounded-lg object-cover shadow-2xl shadow-primary/20"
                data-ai-hint={item.data_ai_hint}
              />
            </div>
            <div className="md:col-span-2 p-6 pr-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-2">{item.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4 text-muted-foreground">
                <div className="flex items-center gap-4">
                    <Badge variant={item.type === 'movie' ? 'default' : 'secondary'}>
                        {item.type === 'movie' ? <Clapperboard className="mr-1.5 h-3 w-3" /> : <Tv className="mr-1.5 h-3 w-3" />}
                        {item.type === 'movie' ? 'Movie' : 'TV Series'}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{item.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-yellow-400">
                        <Star className="h-4 w-4" />
                        <span>{item.imdbRating}</span>
                    </div>
                </div>
                
                <p className="text-base text-foreground/90">{item.plot}</p>

                <div>
                    <h4 className="font-semibold text-lg mb-2 text-foreground flex items-center gap-2"><User /> Director</h4>
                    <p>{item.director}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-2 text-foreground flex items-center gap-2"><Users /> Actors</h4>
                    <div className="flex flex-wrap gap-2">
                    {item.actors.map((actor) => (
                        <Badge key={actor} variant="outline">{actor}</Badge>
                    ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-2 text-foreground">Genre</h4>
                    <div className="flex flex-wrap gap-2">
                    {item.genre.map((g) => (
                        <Badge key={g} variant="outline">{g}</Badge>
                    ))}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
