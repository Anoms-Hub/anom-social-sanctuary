import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { User, Zap, Award, Palette, Settings, LogOut, Edit2, Save } from "lucide-react";
import { useState } from "react";
import React from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const THEME_OPTIONS = [
  { id: "magenta", name: "Neon Magenta", color: "#ff00cc", preview: "🌸" },
  { id: "cyan", name: "Neon Cyan", color: "#00eaff", preview: "💎" },
  { id: "purple", name: "Neon Purple", color: "#b000ff", preview: "👾" },
];

const NAME_COLORS = [
  { id: "#ffffff", name: "White", color: "#ffffff" },
  { id: "#ff00cc", name: "Magenta", color: "#ff00cc" },
  { id: "#00eaff", name: "Cyan", color: "#00eaff" },
  { id: "#b000ff", name: "Purple", color: "#b000ff" },
  { id: "#ffd700", name: "Gold (VIP)", color: "#ffd700" },
  { id: "#c0c0c0", name: "Silver (VIP Max)", color: "#c0c0c0" },
];

export default function Profile() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "customize" | "settings">("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("magenta");
  const [selectedNameColor, setSelectedNameColor] = useState<string>("#00eaff");
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: "",
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = trpc.profile.getMe.useQuery(undefined, {
    enabled: !!user,
  });

  // Update selected theme and name color when profile loads
  React.useEffect(() => {
    if (profile?.neonTheme) setSelectedTheme(profile.neonTheme);
    if (profile?.nameColor) setSelectedNameColor(profile.nameColor);
  }, [profile]);

  // Mutations
  const updateProfileMutation = trpc.profile.updateProfile.useMutation();
  const updateThemeMutation = trpc.profile.updateTheme.useMutation();
  const updateNameColorMutation = trpc.profile.updateNameColor.useMutation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-[#00eaff] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-[#00eaff] flex items-center justify-center">
        <Card className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-8">
          <p className="text-[#ff00cc] mb-4">Please sign in to view your profile</p>
          <Button onClick={() => navigate("/")} className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync(editData);
      toast.success("Profile updated!");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    try {
      await updateThemeMutation.mutateAsync({ theme: theme as "magenta" | "cyan" | "purple" });
      toast.success("Theme updated!");
    } catch (error) {
      toast.error("Failed to update theme");
    }
  };

  const handleNameColorChange = async (color: string) => {
    setSelectedNameColor(color);
    try {
      await updateNameColorMutation.mutateAsync({ nameColor: color });
      toast.success("Name color updated!");
    } catch (error) {
      toast.error("Failed to update name color");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e]">
      {/* Header */}
      <div className="border-b border-[#2a2f3e] bg-[#0b0e14]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#ff00cc]">My Profile</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")} className="text-[#00eaff] border-[#00eaff]">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "customize", label: "Customize", icon: "🎨" },
            { id: "settings", label: "Settings", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg border-2 font-bold transition-all ${
                activeTab === tab.id
                  ? "border-[#ff00cc] bg-[#ff00cc]/20 text-[#ff00cc]"
                  : "border-[#00eaff] bg-transparent text-[#00eaff] hover:bg-[#00eaff]/10"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="md:col-span-1 border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-8">
              <div className="text-center">
                <div
                  className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-6xl border-4 border-[#ff00cc]"
                  style={{ backgroundColor: `${selectedTheme === "magenta" ? "#ff00cc" : selectedTheme === "cyan" ? "#00eaff" : "#b000ff"}20` }}
                >
                  👤
                </div>
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: selectedNameColor }}
                >
                  {user?.name}
                </h2>
                <p className="text-[#7a7f8e] text-sm mb-6">{user?.email}</p>

                {/* VIP Badge - Coming Soon */}
                {/* VIP tier integration will be added in future updates */}

                <div className="space-y-3 bg-[#1a1f2e] p-4 rounded-lg border border-[#2a2f3e]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#00eaff]">Level</span>
                    <span className="font-bold text-[#ff00cc] text-lg">{profile?.level || 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00eaff]">XP</span>
                    <span className="font-bold text-[#ff00cc]">{profile?.xp || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00eaff]">Anom Coins</span>
                    <span className="font-bold text-[#ff00cc]">{profile?.anomCoinBalance || 0} AC</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats & Achievements */}
            <div className="md:col-span-2 space-y-6">
              {/* Stats */}
              <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-6">
                <h3 className="text-xl font-bold text-[#00eaff] mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Your Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#2a2f3e]">
                    <p className="text-[#7a7f8e] text-sm">Level</p>
                    <p className="text-2xl font-bold text-[#ff00cc]">{profile?.level || 1}</p>
                  </div>
                  <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#2a2f3e]">
                    <p className="text-[#7a7f8e] text-sm">Total XP</p>
                    <p className="text-2xl font-bold text-[#ff00cc]">{profile?.xp || 0}</p>
                  </div>
                  <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#2a2f3e]">
                    <p className="text-[#7a7f8e] text-sm">Anom Coins</p>
                    <p className="text-2xl font-bold text-[#ff00cc]">{profile?.anomCoinBalance || 0}</p>
                  </div>
                  <div className="bg-[#1a1f2e] p-4 rounded-lg border border-[#2a2f3e]">
                    <p className="text-[#7a7f8e] text-sm">Member Since</p>
                    <p className="text-2xl font-bold text-[#ff00cc]">{profile?.createdAt ? new Date(profile.createdAt).getFullYear() : 2026}</p>
                  </div>
                </div>
              </Card>

              {/* Recent Achievements */}
              <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-6">
                <h3 className="text-xl font-bold text-[#00eaff] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Achievements
                </h3>
                <div className="space-y-2">
                  <p className="text-[#00eaff]">🏆 First Steps - Complete your profile</p>
                  <p className="text-[#00eaff]">⭐ Rising Star - Reach Level 5</p>
                  <p className="text-[#00eaff]">💎 Collector - Earn 5 achievements</p>
                  <p className="text-[#7a7f8e] text-sm mt-4">More achievements coming soon!</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Customize Tab */}
        {activeTab === "customize" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Theme Selection */}
            <Card className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Neon Theme
              </h3>
              <div className="space-y-3">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      selectedTheme === theme.id
                        ? "border-[#ff00cc] bg-[#ff00cc]/20"
                        : "border-[#2a2f3e] bg-[#1a1f2e] hover:border-[#00eaff]"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white"
                      style={{ backgroundColor: theme.color }}
                    />
                    <div>
                      <p className="font-bold text-[#00eaff]">{theme.name}</p>
                      <p className="text-xs text-[#7a7f8e]">{theme.preview}</p>
                    </div>
                    {selectedTheme === theme.id && <span className="ml-auto text-[#ff00cc]">✓</span>}
                  </button>
                ))}
              </div>
            </Card>

            {/* Name Color Selection */}
            <Card className="border-2 border-[#00eaff] bg-[#0b0e14]/80 p-6">
              <h3 className="text-xl font-bold text-[#00eaff] mb-4 flex items-center gap-2">
                <Edit2 className="w-5 h-5" />
                Name Color
              </h3>
              <div className="space-y-3">
                {NAME_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleNameColorChange(color.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      selectedNameColor === color.id
                        ? "border-[#00eaff] bg-[#00eaff]/20"
                        : "border-[#2a2f3e] bg-[#1a1f2e] hover:border-[#ff00cc]"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white"
                      style={{ backgroundColor: color.color }}
                    />
                    <p className="font-bold" style={{ color: color.color }}>
                      {color.name}
                    </p>
                    {selectedNameColor === color.id && <span className="ml-auto text-[#00eaff]">✓</span>}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <Card className="border-2 border-[#ff00cc] bg-[#0b0e14]/80 p-8">
              <h3 className="text-2xl font-bold text-[#ff00cc] mb-6">Account Settings</h3>

              {!isEditingProfile ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-[#7a7f8e] text-sm mb-2">Name</p>
                    <p className="text-lg font-bold text-[#00eaff]">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-[#7a7f8e] text-sm mb-2">Email</p>
                    <p className="text-lg font-bold text-[#00eaff]">{user?.email}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setEditData({ name: user?.name || "", bio: "" });
                    }}
                    className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold w-full"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#00eaff] mb-2">Name</label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="bg-[#1a1f2e] border-[#ff00cc] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#00eaff] mb-2">Bio</label>
                    <Input
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="bg-[#1a1f2e] border-[#ff00cc] text-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleUpdateProfile}
                      className="flex-1 bg-[#00eaff] hover:bg-[#00eaff]/80 text-black font-bold"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditingProfile(false)}
                      variant="outline"
                      className="flex-1 text-[#ff00cc] border-[#ff00cc]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
                  <div className="mt-8 pt-8 border-t border-[#2a2f3e]">
                <h4 className="text-lg font-bold text-[#00eaff] mb-4">Account Security</h4>
                <p className="text-[#7a7f8e] text-sm mb-4">Your account is secured with Manus OAuth. To change your password, please visit your Manus account settings.</p>
                <Button
                  onClick={() => window.open("https://manus.im/account", "_blank")}
                  variant="outline"
                  className="w-full text-[#ff00cc] border-[#ff00cc] hover:bg-[#ff00cc]/10"
                >
                  Go to Manus Account Settings
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
