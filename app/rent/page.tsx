"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-hooks";
import axios from "axios";
import type { Game } from "@/types/game";
import GameCard from "@/components/game-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import API_URLS from "@/config/urls";

export default function RentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const fetchGames = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      const response = await axios.post(
        API_URLS.FETCH_ALL_GAMES,
        {
          userId,
          page,
          limit: 20,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchTerm || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const newGames = response.data || [];

      if (newGames.length === 0) {
        console.warn("⚠ No games received from API!");
      }

      setGames((prevGames) => (page === 1 ? newGames : [...prevGames, ...newGames]));

      if (newGames.length < 20) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Error fetching games:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, selectedCategory, searchTerm]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames, page, selectedCategory, searchTerm]);

  useEffect(() => {
    setPage(1);
    setGames([]);
    setHasMore(true);
  }, [selectedCategory, searchTerm]);

  const categories = ["Sci-Fi", "Action", "RPG", "Sports", "Shooter", "Racing", "Open World"];

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Available Games for Rent</h1>

      <div className="bg-primary/5 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="search" className="mb-2 block">Search Games</Label>
            <Input
              id="search"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="category" className="mb-2 block">Category</Label>
            <Label htmlFor="category" className="mb-2 block">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.gameId} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold mb-2">No games found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search term</p>
          <button
            onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
