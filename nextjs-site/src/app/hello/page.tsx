"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const greetings = [
  { language: "English", text: "Hello World", flag: "🇬🇧" },
  { language: "Spanish", text: "Hola Mundo", flag: "🇪🇸" },
  { language: "French", text: "Bonjour le Monde", flag: "🇫🇷" },
  { language: "German", text: "Hallo Welt", flag: "🇩🇪" },
  { language: "Italian", text: "Ciao Mondo", flag: "🇮🇹" },
  { language: "Portuguese", text: "Olá Mundo", flag: "🇵🇹" },
  { language: "Japanese", text: "こんにちは世界", flag: "🇯🇵" },
  { language: "Chinese", text: "你好世界", flag: "🇨🇳" },
  { language: "Hindi", text: "नमस्ते दुनिया", flag: "🇮🇳" },
  { language: "Arabic", text: "مرحبا بالعالم", flag: "🇸🇦" },
];

export default function HelloWorld() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % greetings.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentGreeting = greetings[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 w-full max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white">
          <span className="text-6xl md:text-8xl mr-4">{currentGreeting.flag}</span>
        </h1>
        
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentGreeting.text}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-4">
            {currentGreeting.language}
          </p>
        </div>

        <div className="flex justify-center space-x-2 mt-8">
          {greetings.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to ${greetings[index].language}`}
            />
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}