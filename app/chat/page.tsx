"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchChats, sendMessage } from "@/lib/api"
import type { Chat, Message } from "@/types/chat"

export default function ChatPage() {
  const { user, loading } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    const loadChats = async () => {
      try {
        if (user) {
          const userChats = await fetchChats(user.uid)
          setChats(userChats)
          if (userChats.length > 0) {
            setActiveChat(userChats[0])
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadChats()
    }
  }, [user, loading, router])

  useEffect(() => {
    scrollToBottom()
  }, [activeChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !activeChat || !user) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.uid,
      text: message,
      timestamp: new Date().toISOString(),
    }

    // Optimistically update UI
    setActiveChat((prev) => {
      if (!prev) return null
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
      }
    })

    setMessage("")
    scrollToBottom()

    try {
      await sendMessage(activeChat.id, newMessage)
    } catch (error) {
      console.error("Error sending message:", error)
      // Revert optimistic update on error
      setActiveChat((prev) => {
        if (!prev) return null
        return {
          ...prev,
          messages: prev.messages.filter((msg) => msg.id !== newMessage.id),
        }
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="h-[calc(85vh-100px)] shadow-lg border-2 border-primary/10">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="text-xl font-semibold">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-y-auto h-[calc(85vh-180px)] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {chats.length > 0 ? (
                  <ul className="divide-y divide-primary/10">
                    {chats.map((chat) => (
                      <li
                        key={chat.id}
                        className={`p-4 cursor-pointer hover:bg-primary/5 transition-colors ${activeChat?.id === chat.id ? 'bg-primary/10 border-l-4 border-primary' : ''}`}
                        onClick={() => setActiveChat(chat)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src={chat.otherUserPhotoURL || undefined} />
                            <AvatarFallback className="bg-primary/5 text-primary">
                              {chat.otherUserName?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate text-primary">{chat.otherUserName}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.messages.length > 0
                                ? chat.messages[chat.messages.length - 1].text
                                : "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-2">
                    <p className="text-lg font-medium text-primary">No conversations yet</p>
                    <p className="text-sm text-muted-foreground">Start chatting with game owners or renters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-[calc(85vh-100px)] flex flex-col shadow-lg border-2 border-primary/10">
            {activeChat ? (
              <>
                <CardHeader className="border-b bg-primary/5 py-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={activeChat.otherUserPhotoURL || undefined} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {activeChat.otherUserName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl font-semibold text-primary">{activeChat.otherUserName}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  <div className="space-y-6">
                    {activeChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user.uid ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.senderId === user.uid ? "bg-primary text-primary-foreground" : "bg-muted/50"}`}
                        >
                          <p className="text-base">{msg.text}</p>
                          <p
                            className={`text-xs mt-2 ${msg.senderId === user.uid ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-muted/50 border-primary/20 focus-visible:ring-primary"
                    />
                    <Button
                      type="submit"
                      disabled={!message.trim()}
                      className="px-6 hover:bg-primary/90"
                    >
                      Send
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3">
                <h3 className="text-2xl font-semibold text-primary">No conversation selected</h3>
                <p className="text-muted-foreground">Select a conversation from the list or start a new one</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

