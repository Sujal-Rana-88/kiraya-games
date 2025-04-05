export interface Game {
  gameId: string
  gameName: string
  price: number
  image: string
  about: string
  tags: string
  rentedAt: string
  lendedAt: string
  lendingPeriod: number
  userId: string
  buyerId: string | null
  category: string
  isRented: boolean
  isRated: boolean
}

