"use client";

import { useSession, signIn } from "next-auth/react";

const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return null;
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-500/20 text-blue-300 border border-blue-400/50 py-2 px-6 rounded-full font-semibold transition-all duration-300 hover:bg-blue-500/30 hover:border-blue-400/80"
    >
      Sign In
    </button>
  );
};

export default LoginButton;
