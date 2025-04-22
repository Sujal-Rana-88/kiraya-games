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
  const [showChatBot, setShowChatBot] = useState(false)

  // Example of data (you might fetch this dynamically)
  const priceComparison = {
    otherPlatforms: 1500, // Price on another platform
    trending: true, // Is the game trending?
    totalBuyers: 1200, // Total number of buyers
    releaseDate: "2022-08-15", // Release date
  }

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

      {/* Game Details Dialog */}
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
                <p>₹{game.price}</p>
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
          
          {/* ChatBot Popup Button */}
          <Button variant="outline" onClick={() => setShowChatBot(true)} className="mt-4">
            AI Analysis
          </Button>

          {/* ChatBot Dialog */}
          <Dialog open={showChatBot} onOpenChange={setShowChatBot}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>AI Analysis</DialogTitle>
                <DialogDescription>Let's dive into the game details and how it compares!</DialogDescription>
              </DialogHeader>
              <div>
                <p className="text-sm text-muted-foreground">
                  The current price for {game.gameName} on our platform is ₹{game.price}. On other platforms, it is priced at ₹{priceComparison.otherPlatforms}. So, purchasing this game through us offers a price advantage.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This game has been well-received, with over {priceComparison.totalBuyers} buyers. If you're looking for something trending, this game is quite popular, and you are joining a growing community.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {game.gameName} was released on {priceComparison.releaseDate}, and it remains relevant due to its ongoing popularity. If you're unsure, the positive reviews speak volumes about its continued success.
                </p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowChatBot(false)}>
                  Close Chat
                </Button>
              </div>
            </DialogContent>
          </Dialog>

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
