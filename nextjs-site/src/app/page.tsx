import MenuCard from "@/components/molecules/MenuCard";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
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
  );
}