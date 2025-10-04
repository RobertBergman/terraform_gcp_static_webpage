"use client";

import { useSession, signOut } from "next-auth/react";
import Image from 'next/image';

const UserInfo = () => {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 bg-gray-800/50 p-2 rounded-full">
      <Image
        src={session.user?.image || ''}
        alt={session.user?.name || ''}
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className="font-semibold">{session.user?.name}</span>
      <button
        onClick={() => signOut()}
        className="bg-red-500/20 text-red-300 border border-red-400/50 py-2 px-6 rounded-full font-semibold transition-all duration-300 hover:bg-red-500/30 hover:border-red-400/80"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserInfo;