export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
}

export interface Chat {
  id: string
  participants: string[]
  otherUserId: string
  otherUserName: string
  otherUserPhotoURL: string | null
  messages: Message[]
}

