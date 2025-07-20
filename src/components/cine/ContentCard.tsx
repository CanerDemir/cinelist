"use client"

import Image from "next/image"
import type { MediaItem } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, Circle } from "lucide-react"

interface ContentCardProps {
  item: MediaItem
  onToggleWatched: (id: string) => void
  onSelect: () => void
}

export function ContentCard({ item, onToggleWatched, onSelect }: ContentCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer group relative transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50"
      onClick={onSelect}
    >
      <CardContent className="p-0">
        <div className="aspect-[2/3] relative">
          <Image
            src={item.poster}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={item.data_ai_hint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-bold text-base truncate">{item.title}</h3>
          <p className="text-sm text-neutral-300">{item.year}</p>
        </div>
        <div 
          className="absolute top-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatched(item.id);
          }}
        >
          <div className="w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center cursor-pointer border-2 border-transparent group-hover:border-accent transition-colors">
            {item.watched ? (
              <CheckCircle2 className="w-5 h-5 text-accent" />
            ) : (
              <Circle className="w-5 h-5 text-white/70" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
