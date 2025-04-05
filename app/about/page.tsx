import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About KirayaGames</h1>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          The premier platform for gamers to lend and rent games
        </p>

        <div className="space-y-12">
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>Connecting gamers and expanding gaming experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                KirayaGames was founded with a simple mission: to make gaming more accessible and affordable for
                  everyone. We believe that great games should be experienced by as many people as possible, and our
                  platform enables gamers to share their collections while earning extra income.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Simple, secure, and beneficial for everyone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary mb-4">
                      1
                    </div>
                    <h3 className="text-lg font-semibold mb-2">List Your Games</h3>
                    <p>Take photos of your games, set a price, and list them on our platform.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary mb-4">
                      2
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Connect with Renters</h3>
                    <p>Interested gamers will contact you through our secure messaging system.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary mb-4">
                      3
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Earn & Play</h3>
                    <p>Lend your games to earn money, or rent games to try before you buy.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Our Values</CardTitle>
                <CardDescription>What drives us every day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Community</h3>
                    <p>We believe in building a strong community of gamers who share their passion and collections.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Trust</h3>
                    <p>Our platform is built on trust, with secure transactions and user verification.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                    <p>Making gaming more affordable and accessible to everyone is our core mission.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                    <p>We're constantly improving our platform to provide the best experience for our users.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

