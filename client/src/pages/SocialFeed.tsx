import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export default function SocialFeed() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: "1",
      author: "Pixel the Explorer",
      avatar: "🤖",
      content: "Just discovered a new corner of the Anom Universe! The neon glow is absolutely stunning. #AnonArtsy #Exploration",
      timestamp: "2 hours ago",
      likes: 245,
      comments: 18,
      liked: false,
    },
    {
      id: "2",
      author: "Dot's Adventures",
      avatar: "✨",
      content: "My family lounge just hit 100 members! Thanks everyone for making this such a fun space to connect. #FamilyFirst #LoungeLove",
      image: "🎉",
      timestamp: "4 hours ago",
      likes: 512,
      comments: 42,
      liked: false,
    },
    {
      id: "3",
      author: "Cosmic Meme Master",
      avatar: "🌌",
      content: "When you finally unlock that rare achievement... 😎 #AnonArtsy #LevelUp",
      image: "🏆",
      timestamp: "6 hours ago",
      likes: 1203,
      comments: 89,
      liked: false,
    },
    {
      id: "4",
      author: "Neon Enthusiast",
      avatar: "💜",
      content: "The new purple theme is fire! 🔥 Switched all my lounges to this vibe. Who else is team purple? #NeonLife",
      timestamp: "8 hours ago",
      likes: 678,
      comments: 56,
      liked: false,
    },
    {
      id: "5",
      author: "Kids Corner Creator",
      avatar: "🎨",
      content: "My kids just finished all the Pixel & Dot episodes! They're so excited about the coloring pages. Educational + fun! #KidsCorner #ParentWin",
      timestamp: "10 hours ago",
      likes: 423,
      comments: 31,
      liked: false,
    },
  ]);

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    toast.info("Comments feature coming soon!");
  };

  const handleShare = (postId: string) => {
    toast.success("Post shared! 🎉");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Feed...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to view the social feed</p>
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
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-cyan">Live from the Universe</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Create Post Section */}
        <Card
          className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 mb-8"
          style={{
            boxShadow: "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)",
          }}
        >
          <div className="flex gap-4">
            <div className="text-2xl">🌟</div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="What's happening in your Anom Universe?"
                className="w-full bg-[#0b0e14] border border-[#2a2f3e] rounded px-4 py-3 text-[#00eaff] placeholder-[#7a7f8e] focus:outline-none focus:border-[#ff00cc]"
                onClick={() => toast.info("Post creation coming soon!")}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" className="text-[#7a7f8e] border-[#2a2f3e]">
                  Add Image
                </Button>
                <Button className="btn-neon-cyan">Post</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Feed Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#ff00cc] transition-colors"
              style={{
                boxShadow: "0 0 10px rgba(255, 0, 204, 0.3), 0 0 20px rgba(255, 0, 204, 0.1)",
              }}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{post.avatar}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#00eaff]">{post.author}</h3>
                  <p className="text-xs text-[#7a7f8e]">{post.timestamp}</p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-[#00eaff] mb-4 leading-relaxed">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <div className="mb-4 p-4 bg-[#0b0e14] rounded border border-[#2a2f3e] text-center text-3xl">
                  {post.image}
                </div>
              )}

              {/* Post Stats */}
              <div className="flex gap-6 text-sm text-[#7a7f8e] mb-4 pb-4 border-b border-[#2a2f3e]">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>

              {/* Post Actions */}
              <div className="flex justify-around gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-[#7a7f8e] hover:text-[#ff00cc] gap-2"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${post.liked ? "fill-[#ff00cc] text-[#ff00cc]" : ""}`}
                  />
                  <span className="text-sm">{post.liked ? "Liked" : "Like"}</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-[#7a7f8e] hover:text-[#00eaff] gap-2"
                  onClick={() => handleComment(post.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Comment</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-[#7a7f8e] hover:text-[#9d4edd] gap-2"
                  onClick={() => handleShare(post.id)}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="text-[#00eaff] border-[#2a2f3e] gap-2"
            onClick={() => toast.info("More posts loading...")}
          >
            <Zap className="w-4 h-4" />
            Load More Posts
          </Button>
        </div>
      </main>
    </div>
  );
}
