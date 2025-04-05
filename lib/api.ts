// Mock API functions for demonstration purposes
// In a real application, these would make actual API calls to your backend

import type { Game } from "@/types/game"
import type { Chat, Message } from "@/types/chat"
import API_URLS from "@/config/urls";
import axios from "axios";

// Sample data for games
const sampleGames: Game[] = [
  {
    gameId: "1",
    gameName: "The Legend of Zelda: Breath of the Wild",
    price: 5.99,
    image: "https://wallpapercave.com/wp/wp9383665.jpg",
    about: "Explore a world of adventure in this open-world action game.",
    tags: "Adventure, Action, Open World",
    rentedAt: new Date().toISOString(),
    lendedAt: new Date().toISOString(),
    lendingPeriod: 7,
    userId: "user1",
    buyerId: null,
    category: "adventure",
    isRented: false,
    isRated: false,
  },
  {
    gameId: "2",
    gameName: "Super Mario Odyssey",
    price: 4.99,
    image: "https://wallpapercave.com/wp/wp9118760.jpg",
    about: "Join Mario on a massive, globe-trotting 3D adventure.",
    tags: "Platformer, Action, Family",
    rentedAt: new Date().toISOString(),
    lendedAt: new Date().toISOString(),
    lendingPeriod: 5,
    userId: "user2",
    buyerId: null,
    category: "platformer",
    isRented: false,
    isRated: false,
  },
  {
    gameId: "3",
    gameName: "Call of Duty: Modern Warfare",
    price: 6.99,
    image: "https://wallpapercave.com/wp/wp9158830.jpg",
    about: "Experience the ultimate online multiplayer battlefield.",
    tags: "FPS, Action, Multiplayer",
    rentedAt: new Date().toISOString(),
    lendedAt: new Date().toISOString(),
    lendingPeriod: 3,
    userId: "user3",
    buyerId: null,
    category: "fps",
    isRented: false,
    isRated: false,
  },
  {
    gameId: "4",
    gameName: "FIFA 23",
    price: 5.49,
    image: "https://wallpapercave.com/wp/wp11326335.jpg",
    about: "The latest installment in the popular football simulation series.",
    tags: "Sports, Simulation, Multiplayer",
    rentedAt: new Date().toISOString(),
    lendedAt: new Date().toISOString(),
    lendingPeriod: 4,
    userId: "user4",
    buyerId: null,
    category: "sports",
    isRented: false,
    isRated: false,
  },
]

// Sample data for chats
const sampleChats: Chat[] = [
  {
    id: "chat1",
    participants: ["currentUser", "user1"],
    otherUserId: "user1",
    otherUserName: "John Doe",
    otherUserPhotoURL: null,
    messages: [
      {
        id: "msg1",
        senderId: "currentUser",
        text: "Hi, is this game still available?",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "msg2",
        senderId: "user1",
        text: "Yes, it's available. When would you like to rent it?",
        timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
      },
    ],
  },
  {
    id: "chat2",
    participants: ["currentUser", "user2"],
    otherUserId: "user2",
    otherUserName: "Jane Smith",
    otherUserPhotoURL: null,
    messages: [
      {
        id: "msg3",
        senderId: "currentUser",
        text: "Hello, I'm interested in renting Super Mario Odyssey",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
      {
        id: "msg4",
        senderId: "user2",
        text: "Great! It's available for the next 2 weeks",
        timestamp: new Date(Date.now() - 169200000).toISOString(), // 47 hours ago
      },
      {
        id: "msg5",
        senderId: "currentUser",
        text: "Perfect, I'd like to rent it for 5 days",
        timestamp: new Date(Date.now() - 165600000).toISOString(), // 46 hours ago
      },
    ],
  },
]

// API functions

export async function fetchFeaturedGames(): Promise<Game[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return sampleGames
}

export async function fetchAvailableGames(): Promise<Game[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return sampleGames
}

export async function fetchUserGames(userId: string): Promise<Game[]> {
  try {
    const res = await axios.post(API_URLS.FETCH_USER_LENDED_GAMES, { userId });
    return res.data.games;
  } catch (error) {
    console.error("Error fetching user lended games:", error);
    return [];
  }
}

export async function fetchUserRentals(userId: string): Promise<Game[]> {
  try {
    const res = await axios.post(API_URLS.FETCH_RENTED_GAMES, { userId });
    return res.data.games;
  } catch (error) {
    console.error("Error fetching rented games:", error);
    return [];
  }
}

export async function createUser(userData: any): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function fetchChats(userId: string): Promise<Chat[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Replace currentUser with the actual userId in the sample data
  return sampleChats.map((chat) => ({
    ...chat,
    participants: chat.participants.map((p) => (p === "currentUser" ? userId : p)),
    messages: chat.messages.map((msg) => ({
      ...msg,
      senderId: msg.senderId === "currentUser" ? userId : msg.senderId,
    })),
  }))
}

export async function sendMessage(chatId: string, message: Message): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function fetchUnreadNotifications(
  userId: string,
): Promise<{ messageCount: number; notificationCount: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Return random counts for demonstration
  return {
    messageCount: Math.floor(Math.random() * 5),
    notificationCount: Math.floor(Math.random() * 3),
  }
}

export async function sendContactForm(formData: any): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

