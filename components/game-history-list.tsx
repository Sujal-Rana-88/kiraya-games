import type { Game } from "@/types/game"
import { formatDistanceToNow, format } from "date-fns"
import { useState, useEffect } from "react"
import axios from "axios"
import API_URLS from "@/config/urls"

interface GameHistoryListProps {
  games: Game[]
  type: "lend" | "rent"
}

interface GameDetailsProps {
  game: Game
  type: "lend" | "rent"
  onClose: () => void
}

function GameDetails({ game, type, onClose }: GameDetailsProps) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rating, setRating] = useState<number | null>(null) // Current rating
  const [hasRated, setHasRated] = useState(game.isRated || false) // Check if user has rated

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      setError(null)
      try {
        const userId = type === "lend" ? game.buyerId : game.userId

        if (!userId) {
          setError(type === "lend" ? "Game is Not Rented Yet" : "User ID not available")
          return
        }

        const token = localStorage.getItem("token")
        const response = await axios.post(
          API_URLS.FETCH_USER_DATA,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setUserData(response.data)
      } catch (err) {
        setError("Failed to fetch user data. Please try again later.")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [game.gameId, type, game.userId, game.buyerId])

  const startDate = new Date(type === "lend" ? game.lendedAt : game.rentedAt)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + game.lendingPeriod)
  const progress =
    Math.min(1, (new Date().getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100

  const handleRating = async (selectedRating: number) => {
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("user_id")

      const response = await axios.post(
        API_URLS.RATE_USER,
        {
          userId,
          rating: selectedRating,
          gameId: game.gameId, // Ensure gameId is correctly passed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        setRating(selectedRating)
        setHasRated(true)
        // toast.success("Thank you for your rating!"); // Ensure toast is defined or replace with your notification system
        alert("Thank you for your rating!")
      }
    } catch (error) {
      console.error("Error submitting rating:", error)
      // toast.error("Failed to submit rating. Please try again later.");
      alert("Failed to submit rating. Please try again later.")
    }
  }

  const renderInteractiveStars = () => {
    const [hoverRating, setHoverRating] = useState<number | null>(null)

    const handleStarClick = (starIndex: number) => {
      // Call the rating API with the selected rating
      handleRating(starIndex)
    }

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <svg
            key={starIndex}
            className={`w-6 h-6 cursor-pointer ${
              starIndex <= (hoverRating !== null ? hoverRating : rating || 0) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => setHoverRating(starIndex)}
            onMouseLeave={() => setHoverRating(null)}
          >
            <path d="M9.049 3.278l1.951 3.953 4.374.635-3.162 3.082.747 4.356-3.91-2.057-3.91 2.057.747-4.356-3.162-3.082 4.374-.635 1.951-3.953z" />
          </svg>
        ))}
      </div>
    )
  }

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, index) => (
          <svg key={index} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 3.278l1.951 3.953 4.374.635-3.162 3.082.747 4.356-3.91-2.057-3.91 2.057.747-4.356-3.162-3.082 4.374-.635 1.951-3.953z" />
          </svg>
        ))}

        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStar">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="gray" />
              </linearGradient>
            </defs>
            <path
              fill="url(#halfStar)"
              d="M9.049 3.278l1.951 3.953 4.374.635-3.162 3.082.747 4.356-3.91-2.057-3.91 2.057.747-4.356-3.162-3.082 4.374-.635 1.951-3.953z"
            />
          </svg>
        )}

        {[...Array(emptyStars)].map((_, index) => (
          <svg key={index} className="w-5 h-5 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 3.278l1.951 3.953 4.374.635-3.162 3.082.747 4.356-3.91-2.057-3.91 2.057.747-4.356-3.162-3.082 4.374-.635 1.951-3.953z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Game Details</h2>

        {loading && <p className="text-center text-muted-foreground">Loading user data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {userData && (
          <>
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-20 w-20 rounded-full overflow-hidden">
                <img
                  src={userData.profilePictureUrl || "/placeholder-user.jpg"}
                  alt={userData.userName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{userData.userName}</h3>
                <div className="flex items-center">
                  {renderStars(userData.rating)}
                  <span className="text-sm ml-1 text-foreground">
                    ({userData.rating ? userData.rating.toFixed(1) : "No Rating"})
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {userData.firstName} {userData.lastName}
              <br />
              Email: {userData.email}
              <br />
              Phone: {userData.phoneNumber}
            </p>
          </>
        )}

        <h4 className="font-medium truncate text-foreground">{game.gameName}</h4>

        {!error && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {type === "lend" ? "Lent on:" : "Rented on:"} {format(startDate, "MMM dd, yyyy")}
              </span>
              <span>Return by: {format(endDate, "MMM dd, yyyy")}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              {progress < 100 ? `Time remaining: ${formatDistanceToNow(endDate, { addSuffix: true })}` : "Completed"}
            </div>
          </div>
        )}

        <p className="font-medium text-foreground">₹{(game.price / game.lendingPeriod).toFixed(2)}/day</p>
        <p className="text-sm text-muted-foreground">Total: ₹{game.price}</p>

        {/* Conditionally show rating option if game is rented, and hasn't been rated */}
        {type === "rent" && !hasRated && (
          <>
            <p className="text-sm text-muted-foreground">Rate this game:</p>
            {renderInteractiveStars()}
          </>
        )}

        <button
          onClick={onClose}
          className="bg-secondary hover:bg-secondary-foreground text-secondary-foreground hover:text-card font-semibold py-2 px-4 rounded mt-4 w-full transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function GameHistoryList({ games, type }: GameHistoryListProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  if (games.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {type === "lend" ? "You haven't lent any games yet." : "You haven't rented any games yet."}
        </p>
      </div>
    )
  }

  const handleViewDetails = (game: Game) => {
    setSelectedGame(game)
  }

  const handleCloseDetails = () => {
    setSelectedGame(null)
  }

  return (
    <div>
      <div className="space-y-4">
        {games.map((game) => (
          <div
            key={game.gameId}
            className="flex items-center space-x-4 p-4 rounded-lg border border-border bg-card"
          >
            <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={game.image || `/placeholder.svg?height=100&width=100`}
                alt={game.gameName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate text-foreground">{game.gameName}</h4>
              <p className="text-sm text-muted-foreground">
                {type === "lend" ? "Lent" : "Rented"}{" "}
                {formatDistanceToNow(new Date(type === "lend" ? game.lendedAt : game.rentedAt), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {type === "lend" ? "Rental period:" : "Return by:"} {game.lendingPeriod} days
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">₹{(game.price / game.lendingPeriod).toFixed(2)}/day</p>
              <p className="text-sm text-muted-foreground">Total: ₹{game.price}</p>
              <button
                onClick={() => handleViewDetails(game)}
                className="bg-primary hover:bg-primary-foreground text-primary-foreground hover:text-card font-bold py-2 px-4 rounded transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedGame && <GameDetails game={selectedGame} type={type} onClose={handleCloseDetails} />}
    </div>
  )
}
