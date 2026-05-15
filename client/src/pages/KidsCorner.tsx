import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Palette, Gamepad2, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function KidsCorner() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  // Fetch kids content
  const { data: content = [], isLoading: contentLoading } = trpc.kidsCorner.getContent.useQuery();

  // Fetch user's progress
  const { data: progress = [], isLoading: progressLoading } = trpc.kidsCorner.getMyProgress.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Track progress mutation
  const trackProgressMutation = trpc.kidsCorner.trackProgress.useMutation({
    onSuccess: () => {
      toast.success("Progress saved! Great job! 🎉");
    },
    onError: (error) => {
      toast.error(`Failed to save progress: ${error.message}`);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Kids Corner...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to access Kids Corner</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const completedIds = new Set(progress.map((p) => p.contentId));
  const videos = content.filter((c) => c.type === "video");
  const activities = content.filter((c) => c.type !== "video");

  const handleContentClick = (contentId: string, contentType: string) => {
    trackProgressMutation.mutate({
      contentId,
      contentType,
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-magenta">Kids Corner</h1>
          </div>
          <div className="text-sm text-[#7a7f8e]">
            {completedIds.size} / {content.length} completed
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="bg-[#1a1f2e] border border-[#2a2f3e] mb-8">
            <TabsTrigger value="videos" className="text-[#00eaff]">
              <Play className="w-4 h-4 mr-2" />
              Pixel & Dot Videos
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-[#00eaff]">
              <Palette className="w-4 h-4 mr-2" />
              Activities & Games
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            {contentLoading ? (
              <p className="text-[#7a7f8e]">Loading videos...</p>
            ) : videos.length === 0 ? (
              <p className="text-[#7a7f8e]">No videos available yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => {
                  const isCompleted = completedIds.has(video.id);
                  return (
                    <Card
                      key={video.id}
                      className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#ff00cc] transition-colors"
                      style={{
                        boxShadow: "0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#00eaff]">{video.title}</h3>
                          <p className="text-xs text-[#7a7f8e] mt-1">Ages {video.ageRating}+</p>
                        </div>
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-[#00eaff]" />}
                      </div>

                      <p className="text-sm text-[#7a7f8e] mb-4">{video.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#7a7f8e]">{video.duration} min</span>
                        <Button
                          className="btn-neon-cyan gap-2 text-sm"
                          onClick={() => handleContentClick(video.id, video.type)}
                          disabled={trackProgressMutation.isPending}
                        >
                          <Play className="w-3 h-3" />
                          {isCompleted ? "Watched" : "Watch"}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            {contentLoading ? (
              <p className="text-[#7a7f8e]">Loading activities...</p>
            ) : activities.length === 0 ? (
              <p className="text-[#7a7f8e]">No activities available yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {activities.map((activity) => {
                  const isCompleted = completedIds.has(activity.id);
                  const icon =
                    activity.type === "coloring" ? (
                      <Palette className="w-6 h-6" />
                    ) : (
                      <Gamepad2 className="w-6 h-6" />
                    );

                  return (
                    <Card
                      key={activity.id}
                      className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#00eaff] transition-colors"
                      style={{
                        boxShadow: "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-[#ff00cc]">{icon}</div>
                          <div>
                            <h3 className="text-lg font-bold text-[#00eaff]">{activity.title}</h3>
                            <p className="text-xs text-[#7a7f8e] mt-1">Ages {activity.ageRating}+</p>
                          </div>
                        </div>
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-[#00eaff]" />}
                      </div>

                      <p className="text-sm text-[#7a7f8e] mb-6">{activity.description}</p>

                      <Button
                        className="w-full btn-neon-magenta gap-2"
                        onClick={() => handleContentClick(activity.id, activity.type)}
                        disabled={trackProgressMutation.isPending}
                      >
                        {activity.type === "coloring" ? (
                          <>
                            <Palette className="w-4 h-4" />
                            {isCompleted ? "Colored" : "Start Coloring"}
                          </>
                        ) : (
                          <>
                            <Gamepad2 className="w-4 h-4" />
                            {isCompleted ? "Played" : "Play Game"}
                          </>
                        )}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Progress Summary */}
        {!contentLoading && (
          <div className="mt-12 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Your Progress</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#00eaff]">{completedIds.size}</p>
                <p className="text-[#7a7f8e] text-sm">Items Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#ff00cc]">{Math.round((completedIds.size / content.length) * 100)}%</p>
                <p className="text-[#7a7f8e] text-sm">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#9d4edd]">{content.length - completedIds.size}</p>
                <p className="text-[#7a7f8e] text-sm">Items Remaining</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
