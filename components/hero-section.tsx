import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0 rounded-3xl"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Share Games, <br />
              <span className="text-primary">Save Money</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              The premier platform for gamers to lend and rent games. Expand your gaming experience without breaking the
              bank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/rent">Browse Games</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/lend">Lend Your Games</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-primary">U{i}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">1,000+</span> gamers already joined
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src="https://wallpapercave.com/wp/wp9089683.jpg"
                alt="Gaming collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">$</span>
                </div>
                <div>
                  <p className="font-medium">Save up to</p>
                  <p className="text-2xl font-bold">70%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

