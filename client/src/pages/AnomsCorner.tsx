import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Share2, Heart, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Episode {
  id: string;
  title: string;
  videoId: string;
  duration: string;
  views: number;
  postedAt: string;
  description: string;
  featured?: boolean;
}

const episodes: Episode[] = [
  {
    id: "1",
    title: "Pixel & Dot's New Adventure | Anom's Corner",
    videoId: "0pBrQUqU0ig",
    duration: "1:50",
    views: 18,
    postedAt: "1 month ago",
    description: "Join Pixel and Dot on their first adventure in Anom's Corner! Discover their neon-powered world and the mysteries that await.",
    featured: true,
  },
];

export default function AnomsCorner() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(episodes[0]);
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    const url = `https://www.youtube.com/watch?v=${selectedEpisode.videoId}`;
    navigator.clipboard.writeText(url);
    toast.success("Episode link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#0b0e14]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1f2e] to-[#0b0e14] py-12">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #ff00cc 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #00eaff 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span style={{ color: "#ff00cc" }}>Anom</span>
              <span style={{ color: "#00eaff" }}>'s</span>
              <span className="text-white"> Corner</span>
            </h1>
            <p className="text-xl text-[#7a7f8e] mb-6">
              Digital Storybooks featuring <span style={{ color: "#ff00cc" }}>Pixel</span> & <span style={{ color: "#00eaff" }}>Dot</span>
            </p>
            <p className="text-[#7a7f8e] max-w-2xl mx-auto">
              Step into a neon-powered universe where two characters navigate surreal landscapes, uncover mysteries, and create unforgettable moments.
            </p>
          </div>

          {/* Character Badges */}
          <div className="flex justify-center gap-6 mb-12">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: "#ff00cc",
                  background: "linear-gradient(135deg, #ff00cc20 0%, #ff00cc10 100%)",
                  color: "#ff00cc",
                }}
              >
                P
              </div>
              <p className="font-bold text-white">Pixel</p>
              <p className="text-sm text-[#7a7f8e]">The Creator</p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: "#00eaff",
                  background: "linear-gradient(135deg, #00eaff20 0%, #00eaff10 100%)",
                  color: "#00eaff",
                }}
              >
                D
              </div>
              <p className="font-bold text-white">Dot</p>
              <p className="text-sm text-[#7a7f8e]">The Explorer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] overflow-hidden">
              {/* Video Embed */}
              <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedEpisode.videoId}`}
                  title={selectedEpisode.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Episode Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedEpisode.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-[#7a7f8e]">
                      <span>{selectedEpisode.views} views</span>
                      <span>•</span>
                      <span>{selectedEpisode.postedAt}</span>
                    </div>
                  </div>
                  {selectedEpisode.featured && (
                    <Badge className="bg-[#ff00cc] text-black font-bold">Featured</Badge>
                  )}
                </div>

                <p className="text-[#7a7f8e] mb-6">{selectedEpisode.description}</p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setLiked(!liked)}
                    className={`flex-1 ${
                      liked
                        ? "bg-[#ff00cc] text-black hover:bg-[#ff00cc]/80"
                        : "bg-[#2a2f3e] text-[#7a7f8e] hover:bg-[#3a3f4e]"
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                    {liked ? "Liked" : "Like"}
                  </Button>

                  <Button
                    onClick={handleShare}
                    className="flex-1 bg-[#2a2f3e] text-[#7a7f8e] hover:bg-[#3a3f4e]"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Character Info & Episodes */}
          <div className="space-y-6">
            {/* Character Stats */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: "#00eaff" }} />
                Series Stats
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#7a7f8e]">Episodes</span>
                  <span className="font-bold text-white">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7a7f8e]">Total Views</span>
                  <span className="font-bold text-white">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7a7f8e]">Characters</span>
                  <span className="font-bold text-white">2</span>
                </div>
              </div>
            </Card>

            {/* Episodes List */}
            <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Play className="w-5 h-5" style={{ color: "#ff00cc" }} />
                Episodes
              </h3>

              <div className="space-y-2">
                {episodes.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEpisode(ep)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedEpisode.id === ep.id
                        ? "bg-[#ff00cc]/20 border border-[#ff00cc]"
                        : "bg-[#0b0e14] border border-[#2a2f3e] hover:border-[#00eaff]"
                    }`}
                  >
                    <p className="text-sm font-bold text-white truncate">{ep.title}</p>
                    <p className="text-xs text-[#7a7f8e]">{ep.duration}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Character Spotlight */}
            <Card className="bg-gradient-to-br from-[#ff00cc]/10 to-[#00eaff]/10 border border-[#2a2f3e] p-6">
              <h3 className="text-lg font-bold text-white mb-3">Meet the Characters</h3>
              <p className="text-sm text-[#7a7f8e] mb-4">
                Pixel & Dot are on a quest through digital landscapes, discovering hidden truths and creating moments of pure wonder.
              </p>
              <Button className="w-full bg-[#ff00cc] text-black hover:bg-[#ff00cc]/80 font-bold">
                View Profiles
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
