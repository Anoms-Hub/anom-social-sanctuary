import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Send, Settings, Plus, X } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e]">
      {/* Header */}
      <div className="bg-[#1a1f2e] border-b-2 border-[#ff00cc] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#ff00cc]">{lounge.name}</h1>
            <p className="text-[#00eaff]">{lounge.type} Lounge</p>
          </div>
          <Button onClick={() => navigate("/lounges")} className="bg-[#2a2f3e] hover:bg-[#3a3f4e] text-[#00eaff]">
            Back to Lounges
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-[#1a1f2e] border-2 border-[#ff00cc] h-96 flex flex-col">
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div key={idx} className="bg-[#0b0e14] rounded-lg p-3 border border-[#00eaff]/20">
                    <p className="text-[#00eaff] font-bold text-sm">User</p>
                    <p className="text-gray-300 text-sm">{msg.content}</p>
                    <p className="text-[#7a7f8e] text-xs mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="bg-[#1a1f2e] border-2 border-[#ff00cc] text-white"
            />
            <Button
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Members */}
          <Card className="bg-[#1a1f2e] border-2 border-[#00eaff] p-4">
            <h3 className="text-lg font-bold text-[#00eaff] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Members ({members.length})
            </h3>
            <div className="space-y-2">
              {members.map((member, idx) => (
                <div key={idx} className="text-sm text-gray-300 p-2 bg-[#0b0e14] rounded">
                  {member.user?.name || 'Member'}
                </div>
              ))}
            </div>
          </Card>

          {/* Settings */}
          <Card className="bg-[#1a1f2e] border-2 border-[#ff00cc] p-4">
            <h3 className="text-lg font-bold text-[#ff00cc] mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Lounge Settings
            </h3>
            <Button className="w-full bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold mb-2">
              Customize Lounge
            </Button>
            <Button className="w-full bg-[#00eaff] hover:bg-[#00eaff]/80 text-black font-bold">
              Invite Members
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
