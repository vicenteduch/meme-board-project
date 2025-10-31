export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-gradient-to-br from-gray-900 via-purple-900 to-black px-8">
      <h2 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-amber-400 to-violet-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
        About Meme Task Board 💡
      </h2>

      <p className="text-lg text-gray-300 max-w-2xl leading-relaxed mb-6">
        <span className="font-semibold text-amber-300">Meme Task Board</span> is a personal project
        created by <span className="text-pink-400 font-medium">Vicente Duch Moreno</span>.
        <br />
        The goal? To turn boring home chores into a fun and collaborative experience — powered by
        memes, laughter, and a touch of chaos 🎭
      </p>

      <p className="text-sm text-gray-500 italic">
        “Because cleaning is better when you can brag about it with a meme.” 🧽😂
      </p>
    </div>
  );
}
