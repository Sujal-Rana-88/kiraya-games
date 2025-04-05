"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchFeaturedGames } from "@/lib/api"
import type { Game } from "@/types/game"

export default function FeaturedGames() {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGames = async () => {
      try {
        const featuredGames = await fetchFeaturedGames()
        setGames(featuredGames)
      } catch (error) {
        console.error("Error fetching featured games:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGames()
  }, [])

  if (isLoading) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[3/4] bg-muted animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <Card key={game.gameId} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="aspect-[5/6] relative overflow-hidden flex items-center justify-center"> {/* Adjusted aspect ratio */}
            <img
              src={game.image || `/placeholder.svg?height=400&width=300`}
              alt={game.gameName}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="font-medium">
                ${game.price}/day
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg truncate">{game.gameName}</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">{game.category}</p>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">{game.lendingPeriod} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        
        ))}
      </div>
    </div>
  )
}

