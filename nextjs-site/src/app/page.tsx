import MenuCard from "@/components/molecules/MenuCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-12">
      <div className="max-w-3xl space-y-4 text-center">
        <h1 className="font-orbitron text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">FatesBlind</span>
        </h1>
        <p className="text-lg text-gray-400 sm:text-xl">
          Your portal to AI-powered experiences and interactive games
        </p>
      </div>

      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MenuCard
            href="/dashboard"
            icon="🍽️"
            title="Recipe Generator"
            description="Transform grocery receipts into personalized meal plans with AI-powered recipe generation."
            isPublic={false}
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