import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Send, Settings, Plus, X } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface LoungeDetailProps {
  params: { loungeId: string };
}

export default function LoungeDetail({ params }: LoungeDetailProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();
  const loungeId = parseInt(params.loungeId, 10);
  const [messageInput, setMessageInput] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch lounge details
  const { data: lounge, isLoading: loungeLoading } = trpc.lounge.getById.useQuery(
    { loungeId },
    { enabled: isAuthenticated && !!loungeId }
  );

  // Fetch lounge members
  const { data: members = [], isLoading: membersLoading } = trpc.lounge.getMembers.useQuery(
    { loungeId },
    { enabled: isAuthenticated && !!loungeId }
  );

  // Fetch lounge messages
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = trpc.lounge.getMessages.useQuery(
    { loungeId, limit: 50 },
    { enabled: isAuthenticated && !!loungeId }
  );

  // Send message mutation
  const sendMessageMutation = trpc.lounge.sendMessage.useMutation({
    onSuccess: () => {
      setMessageInput("");
      refetchMessages();
    },
    onError: (error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    sendMessageMutation.mutate({
      loungeId,
      content: messageInput,
    });
  };

  if (loading || loungeLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading lounge...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to access this lounge</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!lounge) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Lounge not found</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/lounges")}>
            Back to Lounges
          </Button>
        </div>
      </div>
    );
  }

  const glowColor =
    lounge.neonTheme === "magenta"
      ? "0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)"
      : lounge.neonTheme === "cyan"
        ? "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)"
        : "0 0 10px rgba(157, 78, 221, 0.5), 0 0 20px rgba(157, 78, 221, 0.3)";

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/lounges")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold neon-text-magenta">{lounge.name}</h1>
              <p className="text-xs text-[#7a7f8e] capitalize">{lounge.type} Lounge</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 text-[#ff00cc] border-[#2a2f3e]">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 grid lg:grid-cols-4 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-3 space-y-4">
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-4 h-[500px] flex flex-col"
            style={{ boxShadow: glowColor }}
          >
            {/* Messages */}
            <ScrollArea className="flex-1 mb-4 pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messagesLoading ? (
                  <p className="text-[#7a7f8e] text-center py-8">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-[#7a7f8e] text-center py-8">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.userId === user?.id
                            ? "bg-[#ff00cc] text-[#0b0e14]"
                            : "bg-[#2a2f3e] text-[#00eaff]"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
              />
              <Button
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || !messageInput.trim()}
                className="btn-neon-cyan gap-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Members Section */}
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-4"
            style={{ boxShadow: glowColor }}
          >
            <h3 className="text-lg font-bold text-[#ff00cc] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Members ({members.length})
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {membersLoading ? (
                <p className="text-[#7a7f8e] text-sm">Loading members...</p>
              ) : (
                members.map((item) => (
                  <div key={item.member.id} className="flex items-center justify-between p-2 bg-[#0b0e14] rounded">
                    <div>
                      <p className="text-sm text-[#00eaff] font-medium">{item.user.name}</p>
                      <p className="text-xs text-[#7a7f8e] capitalize">{item.member.role}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Invite Section */}
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-4"
            style={{ boxShadow: glowColor }}
          >
            <h3 className="text-lg font-bold text-[#ff00cc] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Invite Members
            </h3>
            <div className="space-y-2">
              <Input
                placeholder="Enter email..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e] text-sm"
              />
              <Button
                className="w-full btn-neon-magenta text-sm"
                onClick={() => {
                  if (!inviteEmail.trim()) {
                    toast.error("Please enter an email");
                    return;
                  }
                  toast.info("Invite feature coming soon!");
                  setInviteEmail("");
                }}
              >
                Send Invite
              </Button>
            </div>
          </Card>

          {/* Lounge Info */}
          {lounge.description && (
            <Card
              className="bg-[#1a1f2e] border border-[#2a2f3e] p-4"
              style={{ boxShadow: glowColor }}
            >
              <h3 className="text-sm font-bold text-[#ff00cc] mb-2">About</h3>
              <p className="text-sm text-[#7a7f8e]">{lounge.description}</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
