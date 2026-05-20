import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { User, Zap, Award, Palette, Settings, LogOut, Edit2, Save, Share2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import ProfilePhotoManager from "@/components/ProfilePhotoManager";
import IdentitySyncCard from "@/components/IdentitySyncCard";
import { useAuth } from "@/_core/hooks/useAuth";

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
  const [activeTab, setActiveTab] = useState<"dashboard" | "customize" | "settings" | "share">("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("magenta");
  const [selectedNameColor, setSelectedNameColor] = useState<string>("#00eaff");
  const [copied, setCopied] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: "",
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = trpc.profile.getMe.useQuery(undefined, {
    enabled: !!user,
  });

  // Load settings when profile loads
  useEffect(() => {
    if (profile?.neonTheme) setSelectedTheme(profile.neonTheme);
    if (profile?.nameColor) setSelectedNameColor(profile.nameColor);
    if (profile?.bio) setEditData(prev => ({ ...prev, bio: profile.bio || "" }));
  }, [profile]);

  // Mutations
  const updateThemeMutation = trpc.settings.updateTheme.useMutation();
  const updateNameColorMutation = trpc.settings.updateNameColor.useMutation();
  const updateBioMutation = trpc.settings.updateBio.useMutation();

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
      await updateBioMutation.mutateAsync({
        bio: editData.bio,
      });
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

  const profileUrl = `${window.location.origin}/profile/${user?.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Profile link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareProfile = (platform: string) => {
    const message = `Check out my Anom Artsy profile: ${profileUrl}`;
    const encodedMessage = encodeURIComponent(message);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
      toast.success(`Shared on ${platform}!`);
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
              <Button variant="outline" onClick={() => navigate("/")} className="text-[#00eaff] border-[#00eaff] hover:bg-[#00eaff]/10">
                ← Back to Home
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
            { id: "share", label: "Share", icon: "📤" },
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
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#7a7f8e] text-sm">Level</p>
                    <p className="text-4xl font-bold text-[#ff00cc]">{profile?.level || 1}</p>
                  </div>
                  <Zap className="w-12 h-12 text-[#ff00cc] opacity-50" />
                </div>
              </Card>

              <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#7a7f8e] text-sm">Anom Coin Balance</p>
                    <p className="text-4xl font-bold text-[#00eaff]">{profile?.anomCoinBalance || "0"}</p>
                  </div>
                  <Award className="w-12 h-12 text-[#00eaff] opacity-50" />
                </div>
              </Card>
            </div>

            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Bio</h3>
              <p className="text-[#00eaff]">{profile?.bio || "No bio set yet"}</p>
            </Card>
          </div>
        )}

        {/* Customize Tab */}
        {activeTab === "customize" && (
          <div className="space-y-6">
            {/* Theme Selection */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" /> Theme Color
              </h3>
              <p className="text-[#7a7f8e] text-sm mb-4">Choose your profile's neon theme</p>
              <div className="grid grid-cols-3 gap-4">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTheme === theme.id
                        ? "border-[#ff00cc] bg-[#ff00cc]/20"
                        : "border-[#2a2f3e] bg-[#0b0e14] hover:border-[#00eaff]"
                    }`}
                  >
                    <div className="text-3xl mb-2">{theme.preview}</div>
                    <p className="text-sm font-bold text-[#00eaff]">{theme.name}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Name Color Selection */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Name Color</h3>
              <p className="text-[#7a7f8e] text-sm mb-4">Customize how your name appears</p>
              <div className="grid grid-cols-3 gap-4">
                {NAME_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleNameColorChange(color.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedNameColor === color.id
                        ? "border-[#ff00cc] bg-[#ff00cc]/20"
                        : "border-[#2a2f3e] bg-[#0b0e14] hover:border-[#00eaff]"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-[#2a2f3e]"
                      style={{ backgroundColor: color.color }}
                    />
                    <p className="text-sm font-bold text-[#00eaff]">{color.name}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Bio Editor */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Edit Bio</h3>
              {isEditingProfile ? (
                <div className="space-y-4">
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-[#2a2f3e] text-[#00eaff] p-3 rounded-lg"
                    rows={4}
                    placeholder="Enter your bio..."
                  />
                  <div className="flex gap-2">
                    <Button
                      className="bg-[#00eaff] text-[#0b0e14] hover:bg-[#00eaff]/80"
                      onClick={handleUpdateProfile}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="text-[#ff00cc] border-[#2a2f3e]"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[#7a7f8e]">{editData.bio || "No bio set yet"}</p>
                  <Button
                    className="bg-[#ff00cc] text-[#0b0e14] hover:bg-[#ff00cc]/80"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Bio
                  </Button>
                </div>
              )}
            </Card>

            {/* Photo Manager */}
            <ProfilePhotoManager />

            {/* Identity Sync */}
            <IdentitySyncCard />
          </div>
        )}

        {/* Share Tab */}
        {activeTab === "share" && (
          <div className="space-y-6">
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-xl font-bold text-[#ff00cc] mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Share Your Profile
              </h3>
              <p className="text-[#7a7f8e] mb-6">Let others discover your Anom Artsy profile</p>

              {/* Profile Link */}
              <div className="mb-6">
                <label className="text-[#00eaff] text-sm font-bold mb-2 block">Your Profile Link</label>
                <div className="flex gap-2">
                  <Input
                    value={profileUrl}
                    readOnly
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff]"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Social Sharing */}
              <div>
                <label className="text-[#00eaff] text-sm font-bold mb-4 block">Share on Social Media</label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    onClick={() => handleShareProfile("twitter")}
                    className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 text-white font-bold"
                  >
                    𝕏 Twitter
                  </Button>
                  <Button
                    onClick={() => handleShareProfile("facebook")}
                    className="bg-[#1877F2] hover:bg-[#1877F2]/80 text-white font-bold"
                  >
                    f Facebook
                  </Button>
                  <Button
                    onClick={() => handleShareProfile("linkedin")}
                    className="bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white font-bold"
                  >
                    in LinkedIn
                  </Button>
                </div>
              </div>
            </Card>

            {/* Share Info */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-lg font-bold text-[#00eaff] mb-4">💡 Tips</h3>
              <ul className="space-y-2 text-[#7a7f8e] text-sm">
                <li>• Share your profile to show off your customizations</li>
                <li>• Let friends discover your Anom Coin balance and achievements</li>
                <li>• Invite others to join the Anom Artsy community</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
