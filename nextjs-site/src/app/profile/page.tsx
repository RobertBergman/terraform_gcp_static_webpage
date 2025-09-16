"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-white/50"
                />
              ) : (
                <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/50">
                  <span className="text-white text-5xl font-bold">
                    {session?.user?.name?.[0] || "?"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {session?.user?.name || "User"}
              </h1>
              <p className="text-white/80 text-lg mb-4">
                {session?.user?.email}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="bg-white/20 px-4 py-2 rounded-full text-white text-sm">
                  Gamer
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-white text-sm">
                  Premium Member
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-white text-sm">
                  Achievement Hunter
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Account Details</h2>
              <div className="space-y-3">
                <DetailRow label="Member Since" value="January 2024" />
                <DetailRow label="Account Type" value="Premium" />
                <DetailRow label="Language" value="English" />
                <DetailRow label="Time Zone" value="UTC-5" />
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Gaming Stats</h2>
              <div className="space-y-3">
                <DetailRow label="Total Games" value="42" />
                <DetailRow label="Highest Score" value="123,456" />
                <DetailRow label="Play Time" value="127 hours" />
                <DetailRow label="Achievements" value="15/30" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Edit Profile
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Account Settings
            </button>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-white">
      <span className="text-white/70">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}