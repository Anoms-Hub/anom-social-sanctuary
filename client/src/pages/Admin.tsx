import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShoppingBag, TrendingUp, Settings, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalLounge: number;
  totalMerchRequests: number;
  pendingMerchRequests: number;
  totalCoinsDistributed: string;
}

export default function Admin() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();

  // Check if user is admin (in production, verify on backend)
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalLounge: 156,
    totalMerchRequests: 43,
    pendingMerchRequests: 7,
    totalCoinsDistributed: "125,400",
  });

  const [merchRequests] = useState([
    {
      id: "1",
      user: "Sarah M.",
      title: "Custom Pixel T-Shirt",
      status: "pending",
      createdAt: "2026-05-14",
    },
    {
      id: "2",
      user: "Alex K.",
      title: "Neon Hoodie",
      status: "approved",
      createdAt: "2026-05-13",
    },
    {
      id: "3",
      user: "Jordan L.",
      title: "Sticker Pack",
      status: "in_production",
      createdAt: "2026-05-12",
    },
  ]);

  const handleApproveMerch = (id: string) => {
    toast.success("Merch request approved!");
  };

  const handleRejectMerch = (id: string) => {
    toast.error("Merch request rejected");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Admin Dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#ff00cc]" />
          <p className="text-[#00eaff] text-xl mb-4">Admin access required</p>
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
            <h1 className="text-2xl font-bold neon-text-magenta">Admin Dashboard</h1>
          </div>
          <Button variant="outline" className="text-[#ff00cc] border-[#2a2f3e] gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Total Users</p>
                <p className="text-3xl font-bold text-[#ff00cc]">{stats.totalUsers}</p>
                <p className="text-xs text-[#7a7f8e] mt-2">{stats.activeUsers} active today</p>
              </div>
              <Users className="w-8 h-8 text-[#ff00cc] opacity-50" />
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
                <p className="text-[#7a7f8e] text-sm">Active Lounges</p>
                <p className="text-3xl font-bold text-[#00eaff]">{stats.totalLounge}</p>
                <p className="text-xs text-[#7a7f8e] mt-2">Community spaces</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#00eaff] opacity-50" />
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
                <p className="text-[#7a7f8e] text-sm">Merch Requests</p>
                <p className="text-3xl font-bold text-[#9d4edd]">{stats.totalMerchRequests}</p>
                <p className="text-xs text-[#7a7f8e] mt-2">{stats.pendingMerchRequests} pending</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-[#9d4edd] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="merch" className="w-full">
          <TabsList className="bg-[#1a1f2e] border border-[#2a2f3e] mb-8">
            <TabsTrigger value="merch" className="text-[#00eaff]">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Merch Requests
            </TabsTrigger>
            <TabsTrigger value="users" className="text-[#00eaff]">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-[#00eaff]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Merch Tab */}
          <TabsContent value="merch" className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff00cc]">Pending Merch Requests</h3>
            <div className="space-y-4">
              {merchRequests.map((request) => (
                <Card
                  key={request.id}
                  className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
                  style={{
                    boxShadow: "0 0 10px rgba(255, 0, 204, 0.3), 0 0 20px rgba(255, 0, 204, 0.1)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-[#00eaff]">{request.title}</h4>
                      <p className="text-sm text-[#7a7f8e]">by {request.user}</p>
                      <p className="text-xs text-[#7a7f8e] mt-2">Requested: {request.createdAt}</p>
                    </div>
                    <div className="flex gap-2">
                      {request.status === "pending" && (
                        <>
                          <Button
                            className="btn-neon-cyan text-sm"
                            onClick={() => handleApproveMerch(request.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="text-[#ff00cc] border-[#2a2f3e] text-sm"
                            onClick={() => handleRejectMerch(request.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <span className="px-3 py-1 bg-[#0b0e14] text-[#00eaff] text-sm rounded">
                          ✓ Approved
                        </span>
                      )}
                      {request.status === "in_production" && (
                        <span className="px-3 py-1 bg-[#0b0e14] text-[#9d4edd] text-sm rounded">
                          ⚙ In Production
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff00cc]">User Management</h3>
            <Card
              className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
              style={{
                boxShadow: "0 0 10px rgba(0, 234, 255, 0.3), 0 0 20px rgba(0, 234, 255, 0.1)",
              }}
            >
              <p className="text-[#7a7f8e]">User management features coming soon...</p>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-xl font-bold text-[#ff00cc]">Platform Analytics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
                style={{
                  boxShadow: "0 0 10px rgba(0, 234, 255, 0.3), 0 0 20px rgba(0, 234, 255, 0.1)",
                }}
              >
                <h4 className="text-lg font-bold text-[#00eaff] mb-4">Coins Distributed</h4>
                <p className="text-3xl font-bold text-[#ff00cc]">{stats.totalCoinsDistributed} AC</p>
              </Card>

              <Card
                className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
                style={{
                  boxShadow: "0 0 10px rgba(157, 78, 221, 0.3), 0 0 20px rgba(157, 78, 221, 0.1)",
                }}
              >
                <h4 className="text-lg font-bold text-[#00eaff] mb-4">Engagement Rate</h4>
                <p className="text-3xl font-bold text-[#9d4edd]">71.5%</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
