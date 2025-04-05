export default function HowItWorks() {
  const steps = [
    {
      title: "Sign Up",
      description: "Create an account to start lending or renting games",
      icon: (
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
          1
        </div>
      ),
    },
    {
      title: "Browse Games",
      description: "Find games available for rent in your area",
      icon: (
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
          2
        </div>
      ),
    },
    {
      title: "Rent or Lend",
      description: "Rent games from others or lend your own collection",
      icon: (
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
          3
        </div>
      ),
    },
    {
      title: "Enjoy & Return",
      description: "Play the game and return it when the rental period ends",
      icon: (
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
          4
        </div>
      ),
    },
  ]

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        KirayaGames makes it easy to expand your gaming experience without breaking the bank
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join our community of gamers and start sharing your collection today
        </p>
        <div className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 cursor-pointer">
          Get Started
        </div>
      </div>
    </div>
  )
}

