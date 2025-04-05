"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Game } from "@/types/game"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
<Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 w-full">
  <div className="relative overflow-hidden flex items-center justify-center w-full h-[250px]"> 
    {/* Explicit height ensures proper aspect ratio */}
    <img
      src={game.image || `/placeholder.svg?height=400&width=300`}
      alt={game.gameName}
      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute top-2 right-2">
      <Badge variant="secondary" className="font-medium">
      ₹{game.price}
      </Badge>
    </div>
  </div>
  <CardContent className="p-3"> {/* Reduced padding slightly */}
    <h3 className="font-semibold text-lg truncate">{game.gameName}</h3>
    <div className="flex items-center justify-between mt-2">
      <p className="text-sm text-muted-foreground">{game.category}</p>
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{game.lendingPeriod} days</span>
      </div>
    </div>
    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{game.about}</p>
  </CardContent>
  <CardFooter className="p-3 pt-0 flex justify-between">
    <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
      Details
    </Button>
    <Button size="sm" asChild>
      <Link href={`/rent/${game.gameId}`}>Rent Now</Link>
    </Button>
  </CardFooter>
</Card>



      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{game.gameName}</DialogTitle>
            <DialogDescription>Game details and rental information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src={game.image || `/placeholder.svg?height=400&width=300`}
                alt={game.gameName}
                className="w-full h-auto rounded-md"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">About</h4>
                <p>{game.about}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                <p>{game.category}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Price</h4>
                <p>${game.price} per day</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Maximum Lending Period</h4>
                <p>{game.lendingPeriod} days</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Tags</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {game.tags.split("$").map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button asChild>
              <Link href={`/rent/${game.gameId}`}>Rent Now</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

