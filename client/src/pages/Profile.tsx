import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { User, Zap, Award, Palette } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTheme, setSelectedTheme] = useState<"magenta" | "cyan" | "purple">("magenta");

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = trpc.profile.getMe.useQuery();

  // Fetch decoration packages
  const { data: decorations, isLoading: decorationsLoading } = trpc.decorations.list.useQuery();

  // Mutations
  const updateThemeMutation = trpc.profile.updateTheme.useMutation();
  const applyDecorationsMutation = trpc.profile.applyDecorations.useMutation();

  const handleThemeChange = async (theme: "magenta" | "cyan" | "purple") => {
    setSelectedTheme(theme);
    await updateThemeMutation.mutateAsync({ theme });
  };

  const handleApplyDecorations = async (packageIds: number[]) => {
    await applyDecorationsMutation.mutateAsync({ packageIds });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-[#00eaff] flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold neon-text-magenta">Anom Artsy</div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")} className="text-[#ff00cc]">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <div className="md:col-span-1 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-6" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#ff00cc] to-[#00eaff] rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-[#0b0e14]" />
              </div>
              <h2 className="text-2xl font-bold text-[#ff00cc] mb-2">{user?.name}</h2>
              <p className="text-[#7a7f8e] text-sm mb-4">{user?.email}</p>
              <div className="space-y-2 text-sm">
                <p className="text-[#00eaff]">Level: <span className="font-bold text-[#ff00cc]">{profile?.level || 1}</span></p>
                <p className="text-[#00eaff]">XP: <span className="font-bold text-[#ff00cc]">{profile?.xp || 0}</span></p>
                <p className="text-[#00eaff]">Anom Coin: <span className="font-bold text-[#ff00cc]">{profile?.anomCoinBalance || "0"} AC</span></p>
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="md:col-span-2 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-6" style={{boxShadow: '0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)'}}>
            <h3 className="text-xl font-bold text-[#00eaff] mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Neon Theme
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Magenta Theme */}
              <button
                onClick={() => handleThemeChange("magenta")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTheme === "magenta"
                    ? "border-[#ff00cc] bg-[#ff00cc]/10"
                    : "border-[#2a2f3e] hover:border-[#ff00cc]"
                }`}
              >
                <div className="w-full h-12 bg-[#ff00cc] rounded mb-2"></div>
                <p className="text-[#ff00cc] font-bold text-sm">Magenta</p>
              </button>

              {/* Cyan Theme */}
              <button
                onClick={() => handleThemeChange("cyan")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTheme === "cyan"
                    ? "border-[#00eaff] bg-[#00eaff]/10"
                    : "border-[#2a2f3e] hover:border-[#00eaff]"
                }`}
              >
                <div className="w-full h-12 bg-[#00eaff] rounded mb-2"></div>
                <p className="text-[#00eaff] font-bold text-sm">Cyan</p>
              </button>

              {/* Purple Theme */}
              <button
                onClick={() => handleThemeChange("purple")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTheme === "purple"
                    ? "border-[#8b00ff] bg-[#8b00ff]/10"
                    : "border-[#2a2f3e] hover:border-[#8b00ff]"
                }`}
              >
                <div className="w-full h-12 bg-[#8b00ff] rounded mb-2"></div>
                <p className="text-[#8b00ff] font-bold text-sm">Purple</p>
              </button>
            </div>
          </div>
        </div>

        {/* Decoration Marketplace */}
        <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-8" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
          <h3 className="text-2xl font-bold text-[#ff00cc] mb-6 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Decoration Marketplace
          </h3>

          {decorationsLoading ? (
            <p className="text-[#7a7f8e]">Loading decorations...</p>
          ) : decorations && decorations.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {decorations.map((decoration) => (
                <div
                  key={decoration.id}
                  className="bg-[#0b0e14] border border-[#2a2f3e] rounded-lg p-4 hover:border-[#ff00cc] transition-all"
                >
                  <div className="w-full h-24 bg-gradient-to-br from-[#ff00cc] to-[#00eaff] rounded mb-4 flex items-center justify-center">
                    <span className="text-2xl">{decoration.name.charAt(0)}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#00eaff] mb-2">{decoration.name}</h4>
                  <p className="text-[#7a7f8e] text-sm mb-4">{decoration.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xs text-[#7a7f8e]">Price</p>
                      <p className="text-[#ff00cc] font-bold">{decoration.costAnom} AC</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#7a7f8e]">Category</p>
                      <p className="text-[#00eaff] font-bold text-sm">{decoration.category}</p>
                    </div>
                  </div>
                  <Button className="w-full btn-neon-magenta">
                    <Zap className="w-4 h-4 mr-2" />
                    Purchase
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#7a7f8e]">No decorations available yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
