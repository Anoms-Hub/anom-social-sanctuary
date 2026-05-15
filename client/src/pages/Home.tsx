import { Button } from "@/components/ui/button";
import { Zap, Users, Gamepad2, Heart, Sparkles, ShoppingBag } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Anom Artsy...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-[#00eaff] flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-[#2a2f3e] px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold neon-text-magenta">Anom Artsy</div>
            <a href={getLoginUrl()}>
              <Button className="btn-neon-magenta">Sign In</Button>
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 px-6 py-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                <span className="neon-text-magenta">Identity</span>
                <span className="text-[#00eaff]">, Amplified</span>
              </h1>
              <p className="text-lg text-[#7a7f8e] mb-8">
                Join the Anom Artsy community — a neon-lit sanctuary where family comes first, creativity thrives, and your identity matters.
              </p>
              <a href={getLoginUrl()}>
                <Button className="btn-neon-cyan text-lg py-6 px-8">
                  Enter the Universe
                </Button>
              </a>
            </div>
            <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-8" style={{boxShadow: '0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)'}}>
              <div className="text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#ff00cc]" />
                <p className="text-[#00eaff]">Welcome to your digital sanctuary</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#1a1f2e] border-t border-[#2a2f3e] px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 neon-text-magenta">
              What Awaits You
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Zap className="w-8 h-8 text-[#ff00cc] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Anom Coin Economy</h3>
                <p className="text-[#7a7f8e]">
                  Earn coins through social good actions, games, and community engagement. Spend them on profile decorations and exclusive lounges.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Users className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#ff00cc] mb-2">Private Lounges</h3>
                <p className="text-[#7a7f8e]">
                  Create family, friend, and coworker lounges. Chat, share goals, and customize your space with neon themes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Gamepad2 className="w-8 h-8 text-[#ff00cc] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Mini-Games</h3>
                <p className="text-[#7a7f8e]">
                  Play Trivia, Memory, Mood Matcher, and Snack Vault Rush. Earn coins and climb the leaderboard.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Heart className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#ff00cc] mb-2">Kids Corner</h3>
                <p className="text-[#7a7f8e]">
                  A safe space for children to watch Pixel & Dot episodes, play Off-Grid Adventure, and color.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Sparkles className="w-8 h-8 text-[#ff00cc] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Profile Customization</h3>
                <p className="text-[#7a7f8e]">
                  Apply neon themes, character badges, and mood glows to your profile. No coding required.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <ShoppingBag className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#ff00cc] mb-2">Custom Merch</h3>
                <p className="text-[#7a7f8e]">
                  Request your bespoke artwork. We create and fulfill it through our trusted partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#00eaff]">
              Ready to join the Anom Universe?
            </h2>
            <a href={getLoginUrl()}>
              <Button className="btn-neon-magenta text-lg py-6 px-8">
                Get Started Now
              </Button>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#2a2f3e] px-6 py-8 text-center text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. Identity, Amplified.</p>
        </footer>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold neon-text-magenta">Anom Artsy</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#7a7f8e]">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={logout} className="text-[#ff00cc]">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Coin Balance */}
          <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Anom Coin Balance</p>
                <p className="text-3xl font-bold text-[#ff00cc]">0 AC</p>
              </div>
              <Zap className="w-8 h-8 text-[#ff00cc]" />
            </div>
          </div>

          {/* Level */}
          <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Your Level</p>
                <p className="text-3xl font-bold text-[#00eaff]">1</p>
              </div>
              <Sparkles className="w-8 h-8 text-[#00eaff]" />
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Achievements</p>
                <p className="text-3xl font-bold text-[#ff00cc]">0</p>
              </div>
              <Heart className="w-8 h-8 text-[#ff00cc]" />
            </div>
          </div>

          {/* Lounges */}
          <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Your Lounges</p>
                <p className="text-3xl font-bold text-[#00eaff]">0</p>
              </div>
              <Users className="w-8 h-8 text-[#00eaff]" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
            <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full btn-neon-magenta" onClick={() => navigate("/profile")}>
                View Profile
              </Button>
              <Button className="w-full btn-neon-cyan" onClick={() => navigate("/lounges")}>
                Browse Lounges
              </Button>
              <Button className="w-full btn-neon-outline" onClick={() => navigate("/games")}>
                Play Games
              </Button>
            </div>
          </div>

          <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
            <h3 className="text-xl font-bold text-[#00eaff] mb-4">Live from the Universe</h3>
            <p className="text-[#7a7f8e] text-sm">
              Check back soon for community highlights, memes, and universe updates!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
