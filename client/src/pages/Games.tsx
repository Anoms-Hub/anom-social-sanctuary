import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Trophy, Zap, Star } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  reward: number;
  played: boolean;
  highScore?: number;
}

export default function Games() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [games, setGames] = useState<Game[]>([
    {
      id: "pixel-dash",
      title: "Pixel Dash",
      description: "Guide Pixel through the neon maze. Collect coins and avoid obstacles!",
      icon: "🤖",
      difficulty: "Easy",
      reward: 50,
      played: false,
    },
    {
      id: "dot-puzzle",
      title: "Dot's Puzzle Challenge",
      description: "Solve increasingly complex puzzles with Dot. Test your logic skills!",
      icon: "✨",
      difficulty: "Medium",
      reward: 100,
      played: false,
    },
    {
      id: "neon-flyer",
      title: "Neon Flyer",
      description: "Fly through the neon universe and collect power-ups. How far can you go?",
      icon: "🚀",
      difficulty: "Medium",
      reward: 75,
      played: true,
      highScore: 2450,
    },
    {
      id: "cosmic-match",
      title: "Cosmic Match",
      description: "Match cosmic symbols in this fast-paced memory game. Beat the clock!",
      icon: "🌌",
      difficulty: "Easy",
      reward: 40,
      played: false,
    },
    {
      id: "anom-adventure",
      title: "Anom Adventure",
      description: "Epic quest through the Anom Universe. Defeat enemies and find treasures!",
      icon: "⚔️",
      difficulty: "Hard",
      reward: 200,
      played: true,
      highScore: 5680,
    },
    {
      id: "rhythm-master",
      title: "Rhythm Master",
      description: "Follow the beat and tap in time. Show off your rhythm skills!",
      icon: "🎵",
      difficulty: "Medium",
      reward: 85,
      played: false,
    },
  ]);

  const handlePlayGame = (gameId: string) => {
    setGames(
      games.map((game) =>
        game.id === gameId
          ? { ...game, played: true, highScore: Math.floor(Math.random() * 5000) + 1000 }
          : game
      )
    );
    toast.success(`Playing ${games.find((g) => g.id === gameId)?.title}! 🎮`);
  };

  const totalRewards = games.reduce((sum, game) => sum + (game.played ? game.reward : 0), 0);
  const gamesPlayed = games.filter((g) => g.played).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Games...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to play games</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-cyan">Mini-Games Arcade</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Games Played</p>
                <p className="text-3xl font-bold text-[#ff00cc]">{gamesPlayed}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-[#ff00cc] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Coins Earned</p>
                <p className="text-3xl font-bold text-[#00eaff]">{totalRewards} AC</p>
              </div>
              <Zap className="w-8 h-8 text-[#00eaff] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(157, 78, 221, 0.5), 0 0 20px rgba(157, 78, 221, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Games Available</p>
                <p className="text-3xl font-bold text-[#9d4edd]">{games.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-[#9d4edd] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.id}
              className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#ff00cc] transition-colors"
              style={{
                boxShadow: "0 0 10px rgba(255, 0, 204, 0.3), 0 0 20px rgba(255, 0, 204, 0.1)",
              }}
            >
              {/* Game Icon */}
              <div className="text-5xl mb-4 text-center">{game.icon}</div>

              {/* Game Title & Description */}
              <h3 className="text-lg font-bold text-[#00eaff] mb-2">{game.title}</h3>
              <p className="text-sm text-[#7a7f8e] mb-4">{game.description}</p>

              {/* Game Stats */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#2a2f3e]">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-[#0b0e14] rounded text-[#7a7f8e]">
                    {game.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 bg-[#0b0e14] rounded text-[#ff00cc] flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {game.reward} AC
                  </span>
                </div>
              </div>

              {/* High Score or Play Button */}
              {game.played && game.highScore ? (
                <div className="mb-4">
                  <p className="text-xs text-[#7a7f8e] mb-1">High Score</p>
                  <p className="text-2xl font-bold text-[#00eaff] flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#ff00cc]" />
                    {game.highScore}
                  </p>
                </div>
              ) : null}

              {/* Play Button */}
              <Button
                className="w-full btn-neon-magenta gap-2"
                onClick={() => handlePlayGame(game.id)}
              >
                <Gamepad2 className="w-4 h-4" />
                {game.played ? "Play Again" : "Play Now"}
              </Button>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-[#ff00cc] mb-4">More Games Coming Soon!</h3>
          <p className="text-[#7a7f8e] mb-6">
            We're constantly adding new games to the Anom Arcade. Check back soon for more fun and rewards!
          </p>
          <Button className="btn-neon-cyan gap-2">
            <Zap className="w-4 h-4" />
            Notify Me
          </Button>
        </div>
      </main>
    </div>
  );
}
