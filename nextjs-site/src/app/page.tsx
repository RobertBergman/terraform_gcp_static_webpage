import MenuCard from "@/components/molecules/MenuCard";
import { Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-16 py-12">
      {/* Hero Section */}
      <div className="w-full max-w-4xl space-y-6 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-semibold mb-4 animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>Powered by AI</span>
        </div>

        <h1 className="font-orbitron text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              FatesBlind
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-xl -z-10" />
          </span>
        </h1>

        <p className="text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
          Your portal to AI-powered experiences and interactive games
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm text-foreground/80">
            <Zap className="w-4 h-4 text-warning" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm text-foreground/80">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-Powered</span>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Explore Our Apps</h2>
          <p className="text-muted-foreground">Choose an experience to get started</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <MenuCard
            href="/meal-planner"
            icon="🍽️"
            title="Meal Planner"
            description="Generate personalized meal plans based on your preferences and local store sales. AI-powered recipe recommendations."
            isPublic={true}
          />
          <MenuCard
            href="/games/asteroids"
            icon="🚀"
            title="Asteroids"
            description="Classic arcade game rebuilt for the web. Pilot your ship through an asteroid field!"
            isPublic={true}
          />
          <MenuCard
            href="/hello"
            icon="🌍"
            title="Hello World"
            description="Animated greetings in 10 different languages with beautiful transitions."
            isPublic={true}
          />
          <MenuCard
            href="/profile"
            icon="👤"
            title="Profile"
            description="Manage your profile information and preferences."
            isPublic={false}
          />
        </div>
      </div>
    </div>
  );
}